import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import OpenAI from 'openai';
// @ts-ignore
import pdf from 'pdf-parse';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim() === '') {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
    }

    const systemPrompt = `
You are an expert Resume Parser. Extract the user's skills, experience, and education from the provided resume text.
Format the output EXACTLY as this JSON structure:
{
  "skills": ["skill1", "skill2"],
  "experience": [
    { "company": "...", "title": "...", "dates": "...", "bullets": ["...", "..."] }
  ],
  "education": [
    { "institution": "...", "degree": "...", "dates": "..." }
  ]
}
Ensure it is strictly valid JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Resume Text:\n${resumeText}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const extractedData = JSON.parse(response.choices[0].message.content || "{}");

    // Ensure fields exist before stringifying
    const skillsString = JSON.stringify(extractedData.skills || []);
    const experienceString = JSON.stringify(extractedData.experience || []);
    const educationString = JSON.stringify(extractedData.education || []);

    // Upsert the user profile with the new data
    const existingProfile = await prisma.userProfile.findFirst();

    if (existingProfile) {
      await prisma.userProfile.update({
        where: { id: existingProfile.id },
        data: {
          skills: skillsString,
          experience: experienceString,
          education: educationString,
        }
      });
    } else {
      await prisma.userProfile.create({
        data: {
          fullName: 'Parsed User', // Fallback, usually they should set this in the UI
          email: 'parsed@example.com',
          skills: skillsString,
          experience: experienceString,
          education: educationString,
        }
      });
    }

    return NextResponse.json({ success: true, data: extractedData });
  } catch (error: any) {
    console.error("Upload/Parsing error:", error);
    return NextResponse.json({ error: error.message || 'Failed to process resume' }, { status: 500 });
  }
}
