import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

export async function runAutomator(url: string) {
  console.log(`Starting automator for URL: ${url}`)
  try {
    const profile = await prisma.userProfile.findFirst()
    if (!profile) {
      return { success: false, error: 'User profile not found. Please setup profile first.' }
    }

    const nameParts = profile.fullName ? profile.fullName.split(' ') : ['First', 'Last'];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const isLocal = !process.env.VERCEL_ENV;
    
    // For local dev, you usually point to your local Chrome installation.
    // For Vercel, use sparticuz
    const executablePath = isLocal 
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // Default Mac path for local testing
      : await chromium.executablePath();
      
    const sparticuzArgs = await chromium.args;

    const launchOptions: any = { 
      args: isLocal ? puppeteer.defaultArgs() : (sparticuzArgs as string[]),
      defaultViewport: (chromium as any).defaultViewport,
      executablePath,
      headless: (chromium as any).headless,
    };
    const browser = await puppeteer.launch(launchOptions);
    
    const page = await browser.newPage()
    
    console.log("Navigating to URL...");
    await page.goto(url, { waitUntil: 'networkidle2' }).catch((e) => {
        console.log("Navigation warning:", e.message)
    })
    
    console.log("Attempting to fill generic form fields...");

    const safeType = async (selector: string, text: string) => {
      try {
        const el = await page.$(selector);
        if (el && text) {
          await el.type(text);
          console.log(`Filled ${selector}`);
          return true;
        }
      } catch (e) {
         // ignore
      }
      return false;
    }

    await safeType('input[name*="first" i]', firstName);
    await safeType('input[name*="last" i]', lastName);
    await safeType('input[name*="name" i]:not([name*="first"]):not([name*="last"])', profile.fullName || '');
    await safeType('input[type="email"], input[name*="email" i]', profile.email);
    await safeType('input[type="tel"], input[name*="phone" i]', profile.phoneNumber || '');
    await safeType('input[name*="linkedin" i]', profile.linkedInUrl || '');
    await safeType('input[name*="github" i], input[name*="portfolio" i]', profile.githubUrl || '');
    
    await new Promise(resolve => setTimeout(resolve, 2000))

    await browser.close()
    
    return { success: true }
  } catch (error: any) {
    console.error("Automator error:", error)
    return { success: false, error: error.message }
  }
}

