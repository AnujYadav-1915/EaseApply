import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'Software Engineer Fresher';
    
    // In a production environment, you would call JSearch (RapidAPI) or Google Jobs API here:
    // const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=${query}`, { headers: ... });
    
    // For demonstration, returning a mocked list of jobs from top fresher portals
    const mockJobs = [
      { id: 1, title: 'Frontend Developer (Entry Level)', company: 'TechCorp', portal: 'LinkedIn', location: 'Remote', salary: '$60k - $80k', selectionChance: 85, url: 'https://linkedin.com/jobs/view/123' },
      { id: 2, title: 'Junior Fullstack Engineer', company: 'StartupX', portal: 'Wellfound', location: 'San Francisco, CA', salary: '$90k', selectionChance: 92, url: 'https://wellfound.com/jobs/123' },
      { id: 3, title: 'React.js Developer Fresher', company: 'WebSolutions', portal: 'Naukri', location: 'New York, NY', salary: '$70k', selectionChance: 78, url: 'https://naukri.com/jobs/123' },
      { id: 4, title: 'Software Engineer I', company: 'Enterprise Inc', portal: 'Indeed', location: 'Austin, TX', salary: '$85k', selectionChance: 64, url: 'https://indeed.com/jobs/123' },
      { id: 5, title: 'Backend Developer Intern -> Fulltime', company: 'CloudNet', portal: 'Internshala', location: 'Remote', salary: '$50k', selectionChance: 95, url: 'https://internshala.com/jobs/123' },
    ];

    return NextResponse.json({ success: true, jobs: mockJobs });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
