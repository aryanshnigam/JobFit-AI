import React from 'react';
import { Compass, ArrowRight, Code2, Clock, Sparkles, BookOpen } from 'lucide-react';

export function LearningPath({ recommendations }) {
  if (!recommendations) return null;

  const { explanation, skill_gap_summary = [], recommended_learning_path = [], suggested_projects = [], provider_used } = recommendations;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
      {/* AI Explanation Card */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(19, 27, 46, 0.8) 100%)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>AI Fit Analysis & Skill Gap Summary</h3>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
            Powered by {provider_used || 'AI Recommendation Layer'}
          </span>
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
          {explanation}
        </p>
      </div>

      {/* Recommended Learning Path */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Compass size={20} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recommended Sequential Learning Path</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
              Targeted roadmap designed to bridge your exact skill gaps.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recommended_learning_path.map((item, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              {/* Step Circle */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)',
                color: '#fff',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '0.95rem'
              }}>
                {item.step || idx + 1}
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {item.skill}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    ~{item.estimated_hours} hrs
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {item.focus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Projects */}
      {suggested_projects.length > 0 && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Code2 size={20} color="var(--success)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Suggested Portfolio Projects</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                Build these projects to demonstrate practical mastery to recruiters.
              </p>
            </div>
          </div>

          <div className="grid-2">
            {suggested_projects.map((proj, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                    {proj.title}
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                    {proj.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {proj.tech_stack.map((t, tidx) => (
                    <span key={tidx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
