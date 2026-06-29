"use client";

import { useState, useEffect } from 'react';

export default function JobSearchDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/search?query=fresher')
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || []);
        setLoading(false);
      });
  }, []);

  const handleApply = async (jobId: number, modifyFirst: boolean) => {
    setApplyingTo(jobId);
    
    // Simulate the application process
    // In reality, this would trigger our Puppeteer automation endpoint
    setTimeout(() => {
      alert(modifyFirst ? "Resume ATS-Optimized and Auto-Applied successfully!" : "1-Click Auto-Applied successfully!");
      setApplyingTo(null);
    }, 2500);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Job Discovery Engine</h1>
          <p>Aggregating top opportunities from LinkedIn, Indeed, Wellfound, and Naukri.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="pulse">Scanning job portals...</div>
        </div>
      ) : (
        <div className="flex-col gap-4">
          {jobs.map(job => (
            <div key={job.id} className="glass-card flex-between" style={{ alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{job.title}</h3>
                  <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{job.portal}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {job.company} • {job.location} • {job.salary}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Selection Chance</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: job.selectionChance > 80 ? 'var(--success)' : 'var(--accent-color)' }}>
                    {job.selectionChance}%
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleApply(job.id, false)}
                    disabled={applyingTo === job.id}
                  >
                    {applyingTo === job.id ? 'Applying...' : '1-Click Apply'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    onClick={() => handleApply(job.id, true)}
                    disabled={applyingTo === job.id}
                  >
                    Modify Resume & Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}} />
    </div>
  );
}
