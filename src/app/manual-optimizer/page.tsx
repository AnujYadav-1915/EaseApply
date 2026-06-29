"use client";

import { useState } from 'react';

export default function ManualOptimizerPage() {
  const [jdText, setJdText] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setResult(null);

    try {
      // 1. Call OpenAI API to optimize the resume based on the JD
      // For this UI, we mock the baselineResume as we would normally pull it from the DB
      const baselineResume = "Mock Profile Data"; // Trigger real profile DB fetch in the backend
      
      const optimizeRes = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baselineResume, jobDescription: jdText })
      });
      
      if (!optimizeRes.ok) throw new Error("Optimization failed");
      const optimizedData = await optimizeRes.json();
      
      setResult(optimizedData);
    } catch (error) {
      console.error(error);
      alert("Failed to optimize resume.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    try {
      const pdfRes = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: result })
      });
      
      if (!pdfRes.ok) throw new Error("PDF generation failed");
      
      const blob = await pdfRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Optimized_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Manual JD Optimizer</h1>
        <p>Paste a job description below. The AI will instantly tailor your resume and generate a 92+ ATS compliant PDF.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card flex-col gap-4">
          <h3>Job Description Target</h3>
          <p style={{ fontSize: '0.9rem' }}>Paste the raw JD text or a job link.</p>
          <textarea 
            className="input" 
            style={{ minHeight: '300px', resize: 'vertical' }}
            placeholder="Paste Job Description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          ></textarea>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={handleOptimize}
            disabled={isOptimizing || !jdText.trim()}
          >
            {isOptimizing ? "Optimizing Resume to 95% Match..." : "Optimize & Match"}
          </button>
        </div>

        <div className="glass-card flex-col gap-4">
          <h3>Optimization Results</h3>
          
          {!result && !isOptimizing && (
             <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
               Awaiting Job Description...
             </div>
          )}

          {isOptimizing && (
             <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
               <p className="pulse">Analyzing keywords and rewriting bullets...</p>
             </div>
          )}

          {result && (
            <div className="animate-fade-in flex-col gap-4">
              <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>ATS Match Score</h4>
                <h1 style={{ fontSize: '3rem', color: 'var(--success)' }}>{result.atsMatchScore}%</h1>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Optimized for target JD</p>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4>Injected Keywords (Missing from your baseline):</h4>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {result.feedback?.missingKeywords?.map((keyword: string) => (
                    <span key={keyword} className="badge badge-accent">{keyword}</span>
                  ))}
                </div>
              </div>

              {result.feedback?.redFlags?.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,50,50,0.1)', borderLeft: '4px solid #ff4444' }}>
                  <h4 style={{ color: '#ff4444' }}>Red Flags Fixed:</h4>
                  <ul style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#ff4444' }}>
                    {result.feedback.redFlags.map((flag: string, i: number) => <li key={i}>{flag}</li>)}
                  </ul>
                </div>
              )}

              {result.feedback?.skippedSections?.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,150,0,0.1)', borderLeft: '4px solid #ffaa00' }}>
                  <h4 style={{ color: '#ffaa00' }}>Sections ATS Skipped:</h4>
                  <ul style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#ffaa00' }}>
                    {result.feedback.skippedSections.map((sec: string, i: number) => <li key={i}>{sec}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownloadPdf}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download 1-Page PDF
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  1-Click Auto-Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}} />
    </div>
  )
}
