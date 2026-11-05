import axios from 'axios';

const API_BASE = '/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s timeout for ML model execution
});

export const api = {
  checkHealth: async () => {
    const res = await client.get('/health');
    return res.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  analyzeMatch: async ({ resumeFile, resumeText, jobDescriptionText, jobTitle, candidateName }) => {
    const formData = new FormData();
    if (resumeFile) {
      formData.append('resume_file', resumeFile);
    }
    if (resumeText) {
      formData.append('resume_text', resumeText);
    }
    formData.append('job_description_text', jobDescriptionText);
    formData.append('job_title', jobTitle || 'Target Position');
    formData.append('candidate_name', candidateName || 'Candidate');

    const res = await client.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  loadDemo: async (demoId) => {
    const res = await client.post('/demo/load', { demo_id: demoId });
    return res.data;
  },

  getAnalyses: async () => {
    const res = await client.get('/analyses');
    return res.data;
  },

  getAnalysisById: async (analysisId) => {
    const res = await client.get(`/analyses/${analysisId}`);
    return res.data;
  },
};
