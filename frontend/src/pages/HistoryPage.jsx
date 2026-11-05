import React, { useState, useEffect } from 'react';
import { History, Eye, Award, Calendar, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export function HistoryPage({ onViewAnalysis }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAnalyses();
      setHistoryList(data);
    } catch (err) {
      setError('Failed to fetch historical analyses. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Analysis <span className="title-gradient">History</span>
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Review past resume matching runs saved in your database.
          </p>
        </div>

        <button onClick={fetchHistory} className="btn-secondary">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)' }}>
          Loading saved analysis history...
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--danger)', background: 'var(--danger-bg)', padding: '14px', borderRadius: '10px' }}>
          {error}
        </div>
      )}

      {!loading && historyList.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <History size={36} color="var(--text-subtle)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>No Saved Analyses Found</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Run a resume match analysis or load a demo to generate historical records.
          </p>
        </div>
      )}

      {!loading && historyList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {historyList.map((item) => (
            <div 
              key={item.analysis_id}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.2rem',
                  color: 'var(--primary)'
                }}>
                  {item.compatibility_score}
                </div>

                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                    {item.job_title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span style={{ color: 'var(--success)' }}>✓ {item.matched_count} matched</span>
                    <span>•</span>
                    <span style={{ color: 'var(--warning)' }}>⚠ {item.partial_count} partial</span>
                    <span>•</span>
                    <span style={{ color: 'var(--danger)' }}>✗ {item.missing_count} missing</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-neutral">{item.label}</span>
                <button
                  onClick={() => onViewAnalysis(item.analysis_id)}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Eye size={15} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
