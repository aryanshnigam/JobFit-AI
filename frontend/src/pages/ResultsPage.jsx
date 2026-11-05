import React from 'react';
import { ScoreDial } from '../components/ScoreDial';
import { SkillBadges } from '../components/SkillBadges';
import { SkillGapChart } from '../components/SkillGapChart';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { LearningPath } from '../components/LearningPath';
import { ArrowLeft, UserCheck, GraduationCap, Briefcase } from 'lucide-react';

export function ResultsPage({ analysisData, onBack }) {
  if (!analysisData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>No analysis result loaded.</p>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '16px' }}>Back</button>
      </div>
    );
  }

  const {
    job_title,
    candidate_name,
    compatibility_score,
    label,
    score_breakdown,
    matched_skills = [],
    partial_skills = [],
    missing_skills = [],
    evidence = [],
    recommendations
  } = analysisData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={16} />
          <span>New Analysis</span>
        </button>

        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{job_title}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Candidate: {candidate_name || 'Submitted Resume'}</span>
        </div>
      </div>

      {/* Row 1: Score Dial + Skill Gap Recharts */}
      <div className="grid-2">
        <ScoreDial score={compatibility_score} label={label} breakdown={score_breakdown} />
        <SkillGapChart 
          matchedCount={matched_skills.length}
          partialCount={partial_skills.length}
          missingCount={missing_skills.length}
        />
      </div>

      {/* Row 2: Qualitative Experience & Education Analysis Cards */}
      <div className="grid-2">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Briefcase size={20} color="#a855f7" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Experience Relevance Analysis</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Work experience semantic relevance score evaluated at <strong style={{ color: '#fff' }}>{score_breakdown?.experience || 0}/15 points</strong>. Candidate demonstrates direct role overlap with target job description responsibilities.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <GraduationCap size={20} color="#f43f5e" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Education & Qualification Match</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Academic qualifications evaluated at <strong style={{ color: '#fff' }}>{score_breakdown?.education || 0}/10 points</strong>. Degree requirements align with candidate background.
          </p>
        </div>
      </div>

      {/* Row 3: Skill Badges (Matched, Partial, Missing) */}
      <SkillBadges 
        matched={matched_skills}
        partial={partial_skills}
        missing={missing_skills}
      />

      {/* Row 4: Evidence & Resume Quotes Explainability */}
      <EvidenceViewer evidence={evidence} />

      {/* Row 5: AI Recommendations & Visual Learning Path */}
      <LearningPath recommendations={recommendations} />
    </div>
  );
}
