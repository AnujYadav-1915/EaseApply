'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { runAutomator } from '../lib/automator'

import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const prisma = new PrismaClient({ adapter })

// --- Profile Actions ---

export async function getUserProfile() {
  const profile = await prisma.userProfile.findFirst()
  return profile
}

export async function saveUserProfile(formData: FormData) {
  const data = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    location: formData.get('location') as string,
    expectedSalary: formData.get('expectedSalary') as string,
    workAuthorization: formData.get('workAuthorization') as string,
    noticePeriod: formData.get('noticePeriod') as string,
    linkedInUrl: formData.get('linkedInUrl') as string,
    githubUrl: formData.get('githubUrl') as string,
  }

  const existingProfile = await prisma.userProfile.findFirst()

  if (existingProfile) {
    await prisma.userProfile.update({
      where: { id: existingProfile.id },
      data
    })
  } else {
    await prisma.userProfile.create({
      data
    })
  }

  revalidatePath('/profile')
}

// --- Dashboard Actions ---

export async function getDashboardData() {
  const totalJobs = await prisma.jobListing.count()
  const matchingJobs = await prisma.jobListing.count({
    where: { matchScore: { gte: 80 } }
  })
  const appliedJobs = await prisma.jobListing.count({
    where: { status: 'APPLIED' }
  })

  const recentJobs = await prisma.jobListing.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  return {
    totalJobs,
    matchingJobs,
    appliedJobs,
    recentJobs
  }
}

// --- Automation Actions ---

export async function applyToJob(jobId: string) {
  const job = await prisma.jobListing.findUnique({ where: { id: jobId } })
  if (!job) throw new Error("Job not found")

  // Mock application process
  const result = await runAutomator(job.url || "https://example.com/job")

  if (result.success) {
    await prisma.jobListing.update({
      where: { id: jobId },
      data: { status: 'APPLIED' }
    })
    await prisma.applicationLog.create({
      data: { jobId, status: 'SUCCESS' }
    })
  } else {
    await prisma.jobListing.update({
      where: { id: jobId },
      data: { status: 'FAILED' }
    })
    await prisma.applicationLog.create({
      data: { jobId, status: 'FAILED', errorMessage: result.error }
    })
  }

  revalidatePath('/')
  return result
}
