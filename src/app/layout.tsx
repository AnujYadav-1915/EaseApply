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
              <a href="/" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'var(--bg-tertiary)' }}>Dashboard</a>
              <a href="/profile" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>Master Profile</a>
              <a href="/upload" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>Resume Engine</a>
              <a href="/manual-optimizer" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>Manual Optimizer</a>
              <a href="#" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'transparent' }}>Auto-Apply Logs</a>
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
