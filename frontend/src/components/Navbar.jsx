import React from 'react';
import { Cpu, FileSearch, History, PlayCircle, LayoutDashboard, Sparkles } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, healthStatus }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              JobFit <span className="title-gradient">AI</span>
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: '500' }}>
              Semantic Matcher & Skill Gap Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn-secondary ${activeTab === 'dashboard' ? 'active-nav' : ''}`}
            style={{
              background: activeTab === 'dashboard' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderColor: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('analyze')}
            className={`btn-secondary ${activeTab === 'analyze' ? 'active-nav' : ''}`}
            style={{
              background: activeTab === 'analyze' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderColor: activeTab === 'analyze' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'analyze' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <FileSearch size={17} />
            <span>Analyze Resume</span>
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className={`btn-secondary ${activeTab === 'demo' ? 'active-nav' : ''}`}
            style={{
              background: activeTab === 'demo' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              borderColor: activeTab === 'demo' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'demo' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <PlayCircle size={17} />
            <span>Demo Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`btn-secondary ${activeTab === 'history' ? 'active-nav' : ''}`}
            style={{
              background: activeTab === 'history' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderColor: activeTab === 'history' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'history' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <History size={17} />
            <span>History</span>
          </button>
        </nav>

        {/* Engine Status */}
        <div className="badge badge-success" style={{ fontSize: '0.75rem' }}>
          <Sparkles size={13} />
          <span>BGE ML Engine Online</span>
        </div>
      </div>
    </header>
  );
}
