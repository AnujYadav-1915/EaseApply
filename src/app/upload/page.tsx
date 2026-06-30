"use client";

import { useState } from 'react';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      setMessage('Please upload a PDF file.');
      return;
    }

    setIsUploading(true);
    setMessage('Parsing resume with AI...');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      setMessage('Resume parsed and saved successfully! Check your Profile.');
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || 'Failed to parse resume.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Resume Parsing Engine</h1>
        <p>Drop your baseline resume here. Our LLM will extract all your skills and experiences to populate your Master Profile.</p>
      </div>

      <div className="glass-card flex flex-col items-center justify-center" style={{ minHeight: '300px', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--border-focus)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <h3 style={{ marginBottom: '0.5rem' }}>Upload your Resume (PDF)</h3>
        <p style={{ textAlign: 'center', maxWidth: '400px' }}>
          We currently support PDF documents. The system will automatically build your underlying JSON schema.
        </p>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <input 
            type="file" 
            id="resume-upload" 
            style={{ display: 'none' }} 
            accept=".pdf" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label htmlFor="resume-upload" className="btn btn-primary" style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1 }}>
            {isUploading ? 'Uploading...' : 'Select File'}
          </label>
          {message && (
             <p style={{ marginTop: '1rem', color: message.includes('success') ? 'var(--success)' : 'var(--text-secondary)' }}>
               {message}
             </p>
          )}
        </div>
      </div>
    </div>
  )
}
