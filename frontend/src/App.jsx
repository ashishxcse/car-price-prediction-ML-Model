import { useState, useEffect } from 'react';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [metadata, setMetadata] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);

  // Fetch dropdown metadata from backend on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${API_URL}/metadata`);
        const data = await response.json();
        setMetadata(data);
      } catch {
        setError('Failed to connect to backend. Please ensure the Flask server is running on port 5000.');
      } finally {
        setMetaLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <div className="app">
      <div className="app-container">
        <Header />

        {metaLoading && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Loading...
            </p>
          </div>
        )}

        {!metaLoading && !metadata && error && (
          <div className="error-card">
            <p>⚠️ {error}</p>
          </div>
        )}

        {metadata && (
          <div className="main-grid">
            <div className="main-grid-left">
              <PredictionForm
                metadata={metadata}
                onResult={setResult}
                onError={setError}
                onLoading={setLoading}
              />

              {error && (
                <div className="error-card">
                  <p>⚠️ {error}</p>
                </div>
              )}
            </div>

            <div className="main-grid-right">
              <PredictionResult result={result} />
            </div>
          </div>
        )}

        <footer className="footer">
          <p>Built with Flask & React · Powered by RandomForest ML</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
