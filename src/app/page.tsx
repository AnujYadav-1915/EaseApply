import { getDashboardData, applyToJob } from './actions'

export default async function DashboardPage() {
  const { totalJobs, matchingJobs, appliedJobs, recentJobs } = await getDashboardData()

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! The AI is actively scouting for jobs.</p>
        </div>
        <button className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Manual Job Link
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <h4 style={{ color: 'var(--text-secondary)' }}>Jobs Scraped</h4>
          <h2>{totalJobs}</h2>
          <span className="badge badge-success">+12% this week</span>
        </div>
        <div className="glass-card">
          <h4 style={{ color: 'var(--text-secondary)' }}>Matching Profiles</h4>
          <h2>{matchingJobs}</h2>
          <span className="badge badge-warning">Needs Review</span>
        </div>
        <div className="glass-card">
          <h4 style={{ color: 'var(--text-secondary)' }}>Auto-Applied</h4>
          <h2>{appliedJobs}</h2>
          <span className="badge badge-accent">Active</span>
        </div>
      </div>
      
      <h3>Recent Matches</h3>
      <div className="glass-card" style={{ marginTop: '1rem', padding: 0, overflow: 'hidden' }}>
        {recentJobs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No jobs found in the database. 
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1rem' }}>Company</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Match Score</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <strong>{job.company}</strong>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{job.role}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3 }}>
                        <div style={{ width: `${job.matchScore || 0}%`, height: '100%', background: job.matchScore && job.matchScore > 80 ? 'var(--success)' : 'var(--warning)', borderRadius: 3 }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: job.matchScore && job.matchScore > 80 ? 'var(--success)' : 'var(--warning)' }}>{job.matchScore || 0}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span className={`badge ${job.status === 'APPLIED' ? 'badge-success' : job.status === 'FAILED' ? 'badge-warning' : 'badge-accent'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
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
