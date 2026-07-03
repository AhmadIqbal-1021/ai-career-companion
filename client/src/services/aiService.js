// client/src/services/aiService.js

import API from './authService'

export const aiService = {
  analyzeResume: (resumeText) => 
    API.post('/ai/resume-analyze', { resumeText }),
  
  analyzeJobMatch: (resumeText, jobDescription) => 
    API.post('/ai/job-match', { resumeText, jobDescription }),
  
  generateCoverLetter: (data) => 
    API.post('/ai/cover-letter', data),
  
  generateInterviewQuestions: (data) => 
    API.post('/ai/interview-prep', data),
}