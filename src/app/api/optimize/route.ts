import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { baselineResume, jobDescription } = await req.json();

    if (!baselineResume || !jobDescription) {
      return NextResponse.json({ error: 'Missing baselineResume or jobDescription' }, { status: 400 });
    }

    const systemPrompt = `
You are an expert ATS Resume Optimizer.
Your goal is to rewrite a user's baseline resume to score 92+ on ATS scanners for a specific Job Description.

Rules:
1. Keyword Injection: Extract hard skills, soft skills, and exact phrasing from the Job Description and seamlessly integrate them into the resume's experience bullets and skills section.
2. Format: Return pure JSON representing the optimized resume.
3. Brevity: Ensure bullets are concise and impactful (Action Verb + Context + Result).
4. No Hallucinations: Do not invent experiences the user never had. Only reframe existing experience.

JSON Schema:
{
  "personalInfo": { "name": "...", "email": "...", "phone": "...", "location": "...", "linkedin": "..." },
  "summary": "2-3 sentences max, hyper-tailored to the JD.",
  "skills": ["skill1", "skill2", "..."],
  "experience": [
    { "company": "...", "title": "...", "dates": "...", "bullets": ["...", "..."] }
  ],
  "education": [
    { "institution": "...", "degree": "...", "dates": "..." }
  ],
  "atsMatchScore": 95
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Baseline Resume:\n${baselineResume}\n\nJob Description:\n${jobDescription}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const optimizedResume = JSON.parse(response.choices[0].message.content || "{}");
    
    return NextResponse.json(optimizedResume);
  } catch (error) {
    console.error("Optimization error:", error);
    return NextResponse.json({ error: 'Failed to optimize resume' }, { status: 500 });
  }
}
