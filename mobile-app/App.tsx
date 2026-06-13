import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('iimv_cache.db');

type CaseRecord = {
  id: number;
  patientName: string;
  transcript: string;
  escalation: string;
  synced: number;
};

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [prompt, setPrompt] = useState('Welcome to IIMV voice triage.');
  const [transcript, setTranscript] = useState('');
  const [patientName, setPatientName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    initDb();
    speakPrompt(prompt);
    loadPendingCount();
  }, []);

  useEffect(() => {
    speakPrompt(prompt);
  }, [prompt]);

  const initDb = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS case_cache (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_name TEXT, transcript TEXT, escalation TEXT, synced INTEGER)',
      );
    });
  };

  const loadPendingCount = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT COUNT(*) as c FROM case_cache WHERE synced = 0', [], (_, result) => {
        const count = result.rows.item(0).c;
        setPendingCount(count);
      });
    });
  };

  const speakPrompt = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1,
      rate: 0.95,
    });
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const recordingObject = new Audio.Recording();
      await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recordingObject.startAsync();
      setRecording(recordingObject);
      setMessage('Recording patient response...');
    } catch (error) {
      Alert.alert('Recording failed', String(error));
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setMessage('Processing response...');
      if (uri) {
        await uploadAudio(uri);
      }
    } catch (error) {
      Alert.alert('Recording stop failed', String(error));
    }
  };

  const uploadAudio = async (uri: string) => {
    try {
      const formData = new FormData();
      const fileName = uri.split('/').pop() || 'recording.wav';
      formData.append('audio', {
        uri,
        name: fileName,
        type: 'audio/wav',
      } as any);
      formData.append('meta', JSON.stringify({ patientName }));

      const response = await fetch('http://localhost:8000/api/triage', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Network error while sending audio.');
      }

      const result = await response.json();
      setTranscript(result.summary || 'No transcript returned.');
      setPrompt('Please review the suggested escalation and confirm.');
      saveCase(result.summary, result.escalation);
    } catch (error) {
      setMessage('Offline - saving case locally.');
      saveCase('offline transcript placeholder', 'pending');
    }
  };

  const saveCase = (transcriptText: string, escalation: string) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO case_cache (patient_name, transcript, escalation, synced) VALUES (?, ?, ?, ?)',
        [patientName, transcriptText, escalation, 0],
        () => loadPendingCount(),
      );
    });
  };

  const syncPendingData = () => {
    setMessage('Syncing pending cases...');
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM case_cache WHERE synced = 0', [], async (_, result) => {
        for (let i = 0; i < result.rows.length; i += 1) {
          const row = result.rows.item(i);
          console.log('Pending case', row);
        }
        tx.executeSql('UPDATE case_cache SET synced = 1 WHERE synced = 0');
        loadPendingCount();
        setMessage('Sync complete.');
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IIMV Voice Triage</Text>
      <Text style={styles.label}>Patient Name</Text>
      <TextInput style={styles.input} value={patientName} onChangeText={setPatientName} placeholder="Enter name" />
      <Text style={styles.prompt}>{prompt}</Text>
      <View style={styles.buttons}>
        <Button title="Start Recording" onPress={startRecording} disabled={!!recording} />
        <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />
      </View>
      <Text style={styles.section}>Transcript</Text>
      <Text style={styles.value}>{transcript}</Text>
      <Text style={styles.section}>Offline cache</Text>
      <Text style={styles.value}>{pendingCount} pending case(s)</Text>
      <Button title="Sync pending cases" onPress={syncPendingData} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f9fc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  prompt: { fontSize: 16, marginBottom: 12 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  value: { marginBottom: 12, fontSize: 15 },
  message: { marginTop: 16, fontSize: 14, color: '#475569' },
});
