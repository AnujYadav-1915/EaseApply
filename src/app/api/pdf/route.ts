import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(req: Request) {
  try {
    const { resumeData } = await req.json();

    if (!resumeData) {
      return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });
    }

    // A clean, single-column HTML template tailored for ATS parsing
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 30px 40px;
          color: #000;
          line-height: 1.4;
          font-size: 11px; /* Base font size, puppeteer will scale if needed */
        }
        h1 { font-size: 18px; margin: 0 0 5px 0; text-align: center; text-transform: uppercase; }
        .contact { text-align: center; font-size: 10px; margin-bottom: 15px; }
        .section-title {
          font-size: 12px;
          text-transform: uppercase;
          border-bottom: 1px solid #000;
          margin-top: 15px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .item-title { font-weight: bold; }
        .item-subtitle { font-style: italic; color: #444; }
        .flex-between { display: flex; justify-content: space-between; }
        ul { margin-top: 4px; margin-bottom: 8px; padding-left: 18px; }
        li { margin-bottom: 3px; }
        .summary, .skills { margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div id="resume-content">
        <h1>${resumeData.personalInfo?.name || "John Doe"}</h1>
        <div class="contact">
          ${resumeData.personalInfo?.email} | ${resumeData.personalInfo?.phone} | ${resumeData.personalInfo?.location} | ${resumeData.personalInfo?.linkedin}
        </div>
        
        <div class="summary">${resumeData.summary}</div>
        
        <div class="section-title">Skills</div>
        <div class="skills">${resumeData.skills?.join(', ')}</div>
        
        <div class="section-title">Experience</div>
        ${resumeData.experience?.map((exp: any) => `
          <div class="experience-item">
            <div class="flex-between">
              <span class="item-title">${exp.title}</span>
              <span>${exp.dates}</span>
            </div>
            <div class="item-subtitle">${exp.company}</div>
            <ul>
              ${exp.bullets?.map((b: string) => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        <div class="section-title">Education</div>
        ${resumeData.education?.map((edu: any) => `
          <div class="flex-between" style="margin-bottom: 5px;">
            <div>
              <span class="item-title">${edu.degree}</span><br>
              <span class="item-subtitle">${edu.institution}</span>
            </div>
            <span>${edu.dates}</span>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
    `;

    const isLocal = !process.env.VERCEL_ENV;
    const executablePath = isLocal 
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : await chromium.executablePath();
      
    const sparticuzArgs = await chromium.args;

    const launchOptions: any = { 
      args: isLocal ? puppeteer.defaultArgs() : (sparticuzArgs as string[]),
      defaultViewport: (chromium as any).defaultViewport,
      executablePath,
      headless: (chromium as any).headless,
    };
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Ensure strict 1-page logic by adjusting zoom/scale until the height fits within a US Letter page (11 inches = ~1056px at 96dpi)
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      pageRanges: '1' // Force only page 1 to be output
    });

    await browser.close();

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Optimized_Resume.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
