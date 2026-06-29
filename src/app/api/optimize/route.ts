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
You are an expert ATS Resume Optimizer and Senior Recruiter.
Your goal is to rewrite a user's baseline resume to score 92+ on ATS scanners for a specific Job Description.

Rules:
1. ATS Scoring: Score the resume out of 100 based on the JD.
2. Feedback: Identify missing keywords, red flags (e.g., formatting, passive voice, missing metrics), and any sections an ATS might skip.
3. Keyword Injection: Seamlessly integrate missing keywords from the JD into the resume's experience bullets and skills section.
4. Google XYZ Format: Rewrite EVERY bullet point using Google's XYZ format: "Accomplished [X] as measured by [Y], by doing [Z]".
5. No Hallucinations: Do not invent experiences the user never had. Only reframe existing experience.

Return pure JSON matching this exact schema:
{
  "atsMatchScore": 95,
  "feedback": {
    "missingKeywords": ["keyword1", "keyword2"],
    "redFlags": ["flag1", "flag2"],
    "skippedSections": ["section1"]
  },
  "personalInfo": { "name": "...", "email": "...", "phone": "...", "location": "...", "linkedin": "..." },
  "summary": "2-3 sentences max, hyper-tailored to the JD.",
  "skills": ["skill1", "skill2", "..."],
  "experience": [
    { "company": "...", "title": "...", "dates": "...", "bullets": ["...", "..."] }
  ],
  "education": [
    { "institution": "...", "degree": "...", "dates": "..." }
  ]
}
`;

    // Try to get real user profile if baselineResume is not provided
    let finalBaseline = baselineResume;
    if (!finalBaseline || finalBaseline === "Mock Profile Data") {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const profile = await prisma.userProfile.findFirst();
      if (profile) {
        finalBaseline = JSON.stringify({
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education
        });
      }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Baseline Resume:\n${finalBaseline}\n\nJob Description:\n${jobDescription}` }
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
