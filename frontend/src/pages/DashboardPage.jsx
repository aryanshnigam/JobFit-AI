import React from 'react';
import { ArrowRight, Cpu, Target, FileSearch, Sparkles, Award, Compass, PlayCircle, ShieldCheck } from 'lucide-react';

export function DashboardPage({ onNavigate, onLoadDemo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Banner */}
      <div className="glass-card" style={{
        padding: '48px 36px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="badge badge-neutral" style={{ marginBottom: '16px', display: 'inline-flex' }}>
          <Sparkles size={14} color="var(--primary)" />
          <span>Semantic NLP & Transformer Embedding Matching Engine</span>
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.8px' }}>
          Understand How Your Resume <br />
          <span className="title-gradient">Fits Your Dream Job</span>
        </h1>

        <p className="sub-title" style={{ maxWidth: '720px', margin: '0 auto 32px auto' }}>
          JobFit AI uses NLP section parsing, Hugging Face BGE transformer embeddings, cosine similarity matching, and LLMs to analyze skill alignment, extract evidence, and generate personalized learning roadmaps.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('analyze')} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            <FileSearch size={20} />
            <span>Analyze Resume Now</span>
            <ArrowRight size={18} />
          </button>

          <button onClick={() => onNavigate('demo')} className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
            <PlayCircle size={20} />
            <span>Explore Demo Mode</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid-3">
        <div className="glass-card">
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Cpu size={22} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>BGE Embeddings Engine</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Extracts section-level vector embeddings using SentenceTransformers for high-precision semantic matching beyond keyword search.
          </p>
        </div>

        <div className="glass-card">
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Target size={22} color="var(--accent-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Configurable Scoring Engine</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Calculates compatibility across Technical Skills (50%), Semantic Relevance (25%), Experience (15%), and Education (10%).
          </p>
        </div>

        <div className="glass-card">
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Compass size={22} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>AI Learning Roadmap</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Generates step-by-step skill gap recommendations and hands-on portfolio projects to bridge your exact requirements gap.
          </p>
        </div>
      </div>

      {/* Demo Loader Quick Launcher */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Try Instant Demo Profiles</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Run full ML pipeline matching on pre-configured candidate profiles.
            </p>
          </div>
        </div>

        <div className="grid-3">
          <div 
            onClick={() => onLoadDemo('ml_engineer')}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="demo-card-hover"
          >
            <span className="badge badge-success" style={{ marginBottom: '8px', fontSize: '0.75rem' }}>ML & AI</span>
            <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>
              Machine Learning Engineer
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
              Alex Chen • PyTorch, Hugging Face, FastAPI, BGE
            </p>
          </div>

          <div 
            onClick={() => onLoadDemo('backend_developer')}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="demo-card-hover"
          >
            <span className="badge badge-neutral" style={{ marginBottom: '8px', fontSize: '0.75rem' }}>Backend</span>
            <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>
              Backend Engineer
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
              Jordan Taylor • Python, FastAPI, PostgreSQL, Docker
            </p>
          </div>

          <div 
            onClick={() => onLoadDemo('data_analyst')}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="demo-card-hover"
          >
            <span className="badge badge-warning" style={{ marginBottom: '8px', fontSize: '0.75rem' }}>Data</span>
            <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>
              Data Analyst
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
              Morgan Smith • SQL, Python, Pandas, Tableau
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
