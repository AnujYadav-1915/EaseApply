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
    </div>
  )
}
