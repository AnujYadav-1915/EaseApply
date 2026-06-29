import puppeteer from 'puppeteer';
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

    const launchOptions: any = { 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true,
    };
    
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    
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

