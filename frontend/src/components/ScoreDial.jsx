import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

export function ScoreDial({ score, label, breakdown }) {
  // Determine color based on score
  let scoreColor = 'var(--success)';
  let glowColor = 'rgba(16, 185, 129, 0.3)';
  if (score < 65 && score >= 50) {
    scoreColor = 'var(--warning)';
    glowColor = 'rgba(245, 158, 11, 0.3)';
  } else if (score < 50) {
    scoreColor = 'var(--danger)';
    glowColor = 'rgba(244, 63, 94, 0.3)';
  }

  // SVG Circular calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        <Award size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
          Job Compatibility Score
        </h3>
      </div>

      {/* SVG Score Dial */}
      <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 16px auto' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="14"
            fill="transparent"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke={scoreColor}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out', filter: `drop-shadow(0 0 10px ${glowColor})` }}
          />
        </svg>

        {/* Center Text */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: 1, color: scoreColor }}>
            {score}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
            / 100
          </span>
        </div>
      </div>

      {/* Label Badge */}
      <div style={{ marginBottom: '16px' }}>
        <span className="badge" style={{
          background: score >= 65 ? 'var(--success-bg)' : score >= 50 ? 'var(--warning-bg)' : 'var(--danger-bg)',
          color: scoreColor,
          borderColor: scoreColor,
          padding: '6px 16px',
          fontSize: '0.95rem'
        }}>
          <ShieldCheck size={16} />
          {label || 'Analysis Result'}
        </span>
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
        <Info size={14} />
        <span>Project-defined matching metric. Not a hiring guarantee.</span>
      </p>

      {/* Score Breakdown Cards */}
      {breakdown && (
        <div className="grid-2" style={{ gap: '12px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Technical Skills (50%)</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>
              {breakdown.technical_skills} <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>/ 50</span>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Semantic Relevance (25%)</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
              {breakdown.semantic_relevance} <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>/ 25</span>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Experience Fit (15%)</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#a855f7' }}>
              {breakdown.experience} <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>/ 15</span>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Education Fit (10%)</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f43f5e' }}>
              {breakdown.education} <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>/ 10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
