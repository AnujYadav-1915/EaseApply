import { getDashboardData, applyToJob } from './actions'

export default async function DashboardPage() {
  const { totalJobs, matchingJobs, appliedJobs, recentJobs } = await getDashboardData()

  return (
    <div className="animate-fade-in">
      <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Welcome to the Future.</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', opacity: 0.8, maxWidth: '600px' }}>
          Your AI agent is actively scouting, scoring, and optimizing your applications while you sleep.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Trigger Manual Automation
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '3rem' }}>
        <div className="glass-card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>Jobs Scraped</h4>
            <span className="badge badge-success">+12%</span>
          </div>
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--accent-color)' }}>{totalJobs}</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', marginTop: '0.5rem' }}>Active opportunities analyzed</p>
        </div>
        <div className="glass-card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>High Matches</h4>
            <span className="badge badge-warning">Action</span>
          </div>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>{matchingJobs}</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', marginTop: '0.5rem' }}>Awaiting your review</p>
        </div>
        <div className="glass-card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>Auto-Applied</h4>
            <span className="badge badge-accent">Live</span>
          </div>
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--success)' }}>{appliedJobs}</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', marginTop: '0.5rem' }}>Successfully submitted</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h3>Recent AI Matches</h3>
        <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>View All</button>
      </div>
      
      <div className="glass-card" style={{ padding: 0 }}>
        {recentJobs.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-focus)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h4 style={{ color: 'var(--text-primary)' }}>No active matches found</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>The AI agent is currently searching the web...</p>
          </div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Match Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{job.company}</strong>
                  </td>
                  <td>{job.role}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{ flex: 1, height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${job.matchScore || 0}%`, height: '100%', background: job.matchScore && job.matchScore > 80 ? 'var(--success)' : 'var(--warning)' }}></div>
                      </div>
                      <span className="mono" style={{ color: job.matchScore && job.matchScore > 80 ? 'var(--success)' : 'var(--warning)' }}>{job.matchScore || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${job.status === 'APPLIED' ? 'badge-success' : job.status === 'FAILED' ? 'badge-error' : 'badge-warning'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <form action={async () => {
                      'use server'
                      await applyToJob(job.id)
                    }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} disabled={job.status === 'APPLIED'}>
                        {job.status === 'APPLIED' ? 'Applied' : 'Review & Apply'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
