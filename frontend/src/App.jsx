import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    api.checkHealth()
      .then(data => setHealthStatus(data))
      .catch(err => console.log('Health check notice:', err));
  }, []);

  const handleRunAnalysis = async (payload) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await api.analyzeMatch(payload);
      setCurrentAnalysis(result);
      setActiveTab('results');
    } catch (err) {
      console.error('Analysis error:', err);
      const msg = err.response?.data?.detail || err.message || 'Analysis request failed.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = async (demoId) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await api.loadDemo(demoId);
      setCurrentAnalysis(result);
      setActiveTab('results');
    } catch (err) {
      console.error('Demo load error:', err);
      setError('Failed to load demo profile: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistoricalAnalysis = async (analysisId) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await api.getAnalysisById(analysisId);
      setCurrentAnalysis(result);
      setActiveTab('results');
    } catch (err) {
      console.error('Get analysis error:', err);
      setError('Failed to load analysis record.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        healthStatus={healthStatus}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardPage 
            onNavigate={setActiveTab} 
            onLoadDemo={handleLoadDemo}
          />
        )}

        {(activeTab === 'analyze' || activeTab === 'demo') && (
          <AnalysisPage 
            onAnalyze={handleRunAnalysis}
            isLoading={isLoading}
            error={error}
          />
        )}

        {activeTab === 'results' && (
          <ResultsPage 
            analysisData={currentAnalysis}
            onBack={() => setActiveTab('analyze')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage 
            onViewAnalysis={handleViewHistoricalAnalysis}
          />
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-subtle)',
        background: 'rgba(11, 15, 25, 0.9)'
      }}>
        JobFit AI — Semantic Resume-Job Matching & Skill Gap Analyzer • Built with PyTorch, SentenceTransformers & FastAPI
      </footer>
    </div>
  );
}
