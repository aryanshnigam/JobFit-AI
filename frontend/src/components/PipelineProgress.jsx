import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Cpu, Sparkles } from 'lucide-react';

const STEPS = [
  "Extracting resume information...",
  "Analyzing job requirements & taxonomy...",
  "Generating BGE transformer embeddings...",
  "Running cosine similarity skill matching...",
  "Computing weighted compatibility score...",
  "Synthesizing AI learning path & recommendations..."
];

export function PipelineProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '90%', textAlign: 'center', padding: '36px 24px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)'
        }}>
          <Loader2 size={30} color="#ffffff" className="spin-animation" style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>
          Running JobFit <span className="title-gradient">ML Pipeline</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Processing semantic embeddings & candidate skill analysis...
        </p>

        {/* Step List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
          {STEPS.map((stepMsg, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div 
                key={idx} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.88rem',
                  color: isDone ? 'var(--success)' : isCurrent ? 'var(--primary)' : 'var(--text-subtle)',
                  fontWeight: isCurrent ? '700' : '500',
                  opacity: idx > currentStep ? 0.4 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} color="var(--success)" />
                ) : isCurrent ? (
                  <Cpu size={16} color="var(--primary)" />
                ) : (
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                )}
                <span>{stepMsg}</span>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
