import React, { useState } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { PipelineProgress } from '../components/PipelineProgress';

export function AnalysisPage({ onAnalyze, isLoading, error }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [candidateName, setCandidateName] = useState('Candidate');
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState('file'); // 'file' or 'text'

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const fillSampleJob = (role) => {
    if (role === 'ml') {
      setJobTitle('Senior Machine Learning Engineer');
      setJobDescriptionText(`We are looking for a Senior Machine Learning Engineer to design and deploy NLP models.
Responsibilities:
- Build and fine-tune transformer models using PyTorch, Hugging Face, and spaCy.
- Develop backend REST APIs with FastAPI and Python in Docker containers on AWS.
- Architect RAG pipelines with PostgreSQL and vector databases like pgvector.
Requirements:
- 3+ years experience in PyTorch, Scikit-Learn, and NLP.
- Strong skills in FastAPI, Docker, PostgreSQL, and AWS.`);
    } else if (role === 'backend') {
      setJobTitle('Backend Software Engineer');
      setJobDescriptionText(`Seeking a Backend Engineer to build scalable microservices.
Responsibilities:
- Develop high-performance REST APIs using FastAPI, Django, and SQLAlchemy.
- Optimize database performance in PostgreSQL and Redis.
- Deploy services using Docker, Git, and CI/CD pipelines.
Requirements:
- Strong Python, SQL, REST APIs, FastAPI, PostgreSQL, Docker experience.`);
    } else if (role === 'data') {
      setJobTitle('Data Analyst');
      setJobDescriptionText(`Hiring a Data Analyst to transform complex data into actionable insights.
Responsibilities:
- Write complex SQL queries against PostgreSQL data warehouses.
- Build automated analytics scripts in Python using Pandas and NumPy.
- Create dashboards in Tableau and Power BI.
Requirements:
- Proficiency in SQL, Python, Pandas, NumPy, and Tableau.`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resumeFile && (!resumeText || !resumeText.trim())) {
      alert('Please upload a resume file (PDF/DOCX) or paste resume text.');
      return;
    }
    if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
      alert('Please paste a job description (at least 20 characters).');
      return;
    }

    onAnalyze({
      resumeFile: mode === 'file' ? resumeFile : null,
      resumeText: mode === 'text' ? resumeText : null,
      jobDescriptionText,
      jobTitle,
      candidateName
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {isLoading && <PipelineProgress />}

      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Resume & Job Description <span className="title-gradient">Match Analysis</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          Upload a resume (PDF/DOCX) and paste target job description to run transformer embeddings and skill gap analysis.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-bg)',
          border: '1px solid var(--danger-border)',
          color: 'var(--danger)',
          padding: '14px 18px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="grid-2">
          {/* SECTION 1: RESUME INPUT */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>1. Candidate Resume</h3>
                
                {/* Mode Selector */}
                <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setMode('file')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      background: mode === 'file' ? 'var(--primary)' : 'transparent',
                      color: mode === 'file' ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('text')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      background: mode === 'text' ? 'var(--primary)' : 'transparent',
                      color: mode === 'text' ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    Paste Text
                  </button>
                </div>
              </div>

              {mode === 'file' ? (
                <div>
                  <div 
                    className={`dropzone ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('resume-file-input').click()}
                  >
                    <input
                      id="resume-file-input"
                      type="file"
                      accept=".pdf,.docx,.txt"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <Upload size={36} color="var(--primary)" style={{ marginBottom: '12px' }} />
                    <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>
                      Drag & Drop your resume here
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                      Supports PDF, DOCX, or TXT files up to 10MB
                    </p>
                  </div>

                  {resumeFile && (
                    <div style={{
                      marginTop: '16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid var(--success-border)',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={20} color="var(--success)" />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>{resumeFile.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{(resumeFile.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Ready</span>
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  rows={10}
                  className="form-textarea"
                  placeholder="Paste candidate resume full text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              )}
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Candidate Name (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Alex Chen"
              />
            </div>
          </div>

          {/* SECTION 2: JOB DESCRIPTION INPUT */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>2. Job Description</h3>
                
                {/* Sample Presets */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => fillSampleJob('ml')}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    + ML Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSampleJob('backend')}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    + Backend
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSampleJob('data')}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    + Data
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Target Job Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Machine Learning Engineer"
                />
              </div>

              <textarea
                rows={9}
                className="form-textarea"
                placeholder="Paste job description requirements here..."
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                <Zap size={20} />
                <span>Analyze Match Now</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
