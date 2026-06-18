import { getUserProfile, saveUserProfile } from '../actions'

export default async function ProfilePage() {
  const profile = await getUserProfile()

  return (
    <div className="animate-fade-in">
      <form action={saveUserProfile}>
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <div>
            <h1>Master Profile</h1>
            <p>This data is injected automatically during the auto-apply process.</p>
          </div>
          <button type="submit" className="btn btn-primary">Save Profile</button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card flex-col gap-4">
            <h3>Personal Details</h3>
            <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" name="fullName" className="input" defaultValue={profile?.fullName || ''} placeholder="e.g. John Doe" />
            </div>
            <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" name="email" className="input" defaultValue={profile?.email || ''} placeholder="e.g. john@example.com" />
            </div>
            <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Phone Number</label>
              <input type="text" name="phoneNumber" className="input" defaultValue={profile?.phoneNumber || ''} placeholder="e.g. +1 234 567 8900" />
            </div>
            <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Location</label>
              <input type="text" name="location" className="input" defaultValue={profile?.location || ''} placeholder="e.g. San Francisco, CA (or Remote)" />
            </div>
          </div>

          <div className="glass-card flex-col gap-4">
            <h3>Job Preferences</h3>
            <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expected Salary (USD)</label>
              <input type="text" name="expectedSalary" className="input" defaultValue={profile?.expectedSalary || ''} placeholder="e.g. $120,000 - $150,000" />
            </div>
            <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Work Authorization</label>
              <select name="workAuthorization" className="input" defaultValue={profile?.workAuthorization || 'Citizen / Green Card'} style={{ appearance: 'none' }}>
                <option value="Citizen / Green Card">Citizen / Green Card</option>
                <option value="Requires Sponsorship (H1B, etc)">Requires Sponsorship (H1B, etc)</option>
                <option value="OPT / CPT">OPT / CPT</option>
              </select>
            </div>
            <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Notice Period</label>
              <input type="text" name="noticePeriod" className="input" defaultValue={profile?.noticePeriod || ''} placeholder="e.g. 2 weeks" />
            </div>
            <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>LinkedIn / GitHub URLs</label>
              <input type="url" name="linkedInUrl" className="input" defaultValue={profile?.linkedInUrl || ''} placeholder="LinkedIn URL" style={{ marginBottom: '0.5rem' }} />
              <input type="url" name="githubUrl" className="input" defaultValue={profile?.githubUrl || ''} placeholder="GitHub / Portfolio URL" />
            </div>
          </div>
        </div>
      </form>

      {/* Render Extracted Data */}
      <div className="grid grid-cols-1 gap-6" style={{ marginTop: '2rem' }}>
        <div className="glass-card flex-col gap-4">
          <h3>Parsed Resume Data</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            This data is generated from your uploaded resume.
          </p>

          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Skills</h4>
            <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile?.skills && JSON.parse(profile.skills).length > 0 ? (
                JSON.parse(profile.skills).map((skill: string) => (
                  <span key={skill} className="badge badge-accent">{skill}</span>
                ))
              ) : (
                <span style={{ color: 'var(--text-secondary)' }}>No skills extracted yet. Upload a resume.</span>
              )}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
             <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Experience</h4>
             {profile?.experience && JSON.parse(profile.experience).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {JSON.parse(profile.experience).map((exp: any, i: number) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                       <strong>{exp.title}</strong> at {exp.company} <span style={{ float: 'right', fontSize: '0.85rem' }}>{exp.dates}</span>
                       <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                         {exp.bullets?.map((b: string, bi: number) => <li key={bi}>{b}</li>)}
                       </ul>
                    </div>
                  ))}
                </div>
             ) : (
                <span style={{ color: 'var(--text-secondary)' }}>No experience extracted yet.</span>
             )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
             <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Education</h4>
             {profile?.education && JSON.parse(profile.education).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {JSON.parse(profile.education).map((edu: any, i: number) => (
                    <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                       <strong>{edu.degree}</strong> from {edu.institution} <span style={{ float: 'right', fontSize: '0.85rem' }}>{edu.dates}</span>
                    </div>
                  ))}
                </div>
             ) : (
                <span style={{ color: 'var(--text-secondary)' }}>No education extracted yet.</span>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
