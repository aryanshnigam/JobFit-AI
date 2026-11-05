import React from 'react';
import { FileText, Quote, CheckCircle2, AlertCircle } from 'lucide-react';

export function EvidenceViewer({ evidence = [] }) {
  if (!evidence || evidence.length === 0) {
    return null;
  }

  return (
    <div className="glass-card" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <FileText size={20} color="var(--accent-cyan)" />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Explainability & Supporting Evidence</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
            Quotes extracted directly from your resume text supporting matched job requirements.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {evidence.map((item, idx) => {
          const isMatched = item.status === 'Matched';
          return (
            <div 
              key={idx} 
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderLeft: `4px solid ${isMatched ? 'var(--success)' : 'var(--warning)'}`,
                borderRadius: '10px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {item.requirement}
                </span>
                <span className={`badge ${isMatched ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.78rem' }}>
                  {isMatched ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  {item.status}
                </span>
              </div>

              {/* Quote Citation */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px', background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '8px' }}>
                <Quote size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.5' }}>
                  "{item.evidence_quote}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
