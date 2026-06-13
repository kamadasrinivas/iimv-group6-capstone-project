import { useEffect, useState } from 'react';
import axios from 'axios';

type CaseItem = {
  id: number;
  patient_name: string;
  transcription: string;
  escalation: string;
  soap_note: string;
};

function App() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const response = await axios.get<CaseItem[]>('http://localhost:8000/api/cases');
      setCases(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <header>
        <h1>IIMV Pilot Dashboard</h1>
        <p>Review triage summaries and case records from the mobile app.</p>
        <button onClick={loadCases} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh cases'}
        </button>
      </header>
      <section style={{ marginTop: 24 }}>
        {cases.length === 0 ? (
          <p>No case records yet.</p>
        ) : (
          cases.map(item => (
            <article key={item.id} style={{ marginBottom: 18, padding: 16, border: '1px solid #d1d5db', borderRadius: 12 }}>
              <h2>{item.patient_name || 'Unknown patient'}</h2>
              <p><strong>Escalation:</strong> {item.escalation}</p>
              <p><strong>Transcript:</strong> {item.transcription}</p>
              <p><strong>SOAP note:</strong> {item.soap_note}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
