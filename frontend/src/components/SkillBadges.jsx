import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Search, Layers } from 'lucide-react';

export function SkillBadges({ matched = [], partial = [], missing = [] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const matchedItems = matched.map(m => ({ ...m, status: 'matched' }));
  const partialItems = partial.map(p => ({ ...p, status: 'partial' }));
  const missingItems = missing.map(m => ({ ...m, status: 'missing' }));

  const allSkills = [...matchedItems, ...partialItems, ...missingItems];

  const filteredSkills = allSkills.filter(item => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'matched' && item.status === 'matched') ||
      (activeTab === 'partial' && item.status === 'partial') ||
      (activeTab === 'missing' && item.status === 'missing');

    const matchesSearch = item.skill.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Skill Match Breakdown</h3>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '34px', paddingUp: '6px', paddingBottom: '6px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('all')}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.85rem', background: activeTab === 'all' ? 'rgba(255,255,255,0.12)' : 'transparent' }}
        >
          All ({allSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('matched')}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'var(--success)', borderColor: 'var(--success-border)', background: activeTab === 'matched' ? 'var(--success-bg)' : 'transparent' }}
        >
          ✓ Matched ({matched.length})
        </button>
        <button
          onClick={() => setActiveTab('partial')}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'var(--warning)', borderColor: 'var(--warning-border)', background: activeTab === 'partial' ? 'var(--warning-bg)' : 'transparent' }}
        >
          ⚠ Partial ({partial.length})
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger-border)', background: activeTab === 'missing' ? 'var(--danger-bg)' : 'transparent' }}
        >
          ✗ Missing ({missing.length})
        </button>
      </div>

      {/* Badges Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {filteredSkills.map((item, idx) => {
          let badgeClass = 'badge-success';
          let Icon = CheckCircle;
          let prefix = '✓';

          if (item.status === 'partial') {
            badgeClass = 'badge-warning';
            Icon = AlertTriangle;
            prefix = '⚠';
          } else if (item.status === 'missing') {
            badgeClass = 'badge-danger';
            Icon = XCircle;
            prefix = '✗';
          }

          return (
            <span key={idx} className={`badge ${badgeClass}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              <Icon size={14} />
              <span>{item.skill}</span>
              {item.matched_with && (
                <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '4px' }}>
                  (similar to {item.matched_with})
                </span>
              )}
            </span>
          );
        })}

        {filteredSkills.length === 0 && (
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', padding: '12px 0' }}>
            No skills found matching filter.
          </p>
        )}
      </div>
    </div>
  );
}
