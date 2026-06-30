import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JobApply Automator',
  description: 'AI-powered job searching and automated applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="dashboard-layout">
          <aside className="sidebar">
            <div className="flex items-center gap-2" style={{ marginBottom: '2rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-color)' }}></div>
              <h3>Automator</h3>
            </div>
            
            <nav className="flex flex-col gap-2">
              <a href="/" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent-color)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                Dashboard
              </a>
              <a href="/profile" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Master Profile
              </a>
              <a href="/upload" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Resume Engine
              </a>
              <a href="/manual-optimizer" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                Manual Optimizer
              </a>
              <a href="/search" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Job Search
              </a>
              <a href="#" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                Auto-Apply Logs
              </a>
            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
