import { describe, it, expect, vi } from 'vitest'
import { getProtectedJobs } from '../server/jobsHandler.js'

describe('Adversarial Security & Data Protection Tests', () => {
  it('Security Vector 1: Unauthorized HTTP Methods Rejected', async () => {
    let responseStatus = 200
    let responseData: any = null

    const mockReq: any = { method: 'DELETE', headers: {} }
    const mockRes: any = {
      status: (code: number) => {
        responseStatus = code
        return mockRes
      },
      json: (data: any) => {
        responseData = data
        return mockRes
      },
    }

    await getProtectedJobs(mockReq, mockRes)
    expect(responseStatus).toBe(405)
    expect(responseData.error).toBe('Method not allowed')
  })

  it('Security Vector 2: Direct Application URLs are Safe & Well-formed', async () => {
    let responseData: any = null
    const mockReq: any = {
      method: 'GET',
      headers: {},
    }
    const mockRes: any = {
      status: () => mockRes,
      json: (data: any) => {
        responseData = data
        return mockRes
      },
    }

    await getProtectedJobs(mockReq, mockRes)

    expect(responseData.success).toBe(true)
    expect(responseData.jobs.length).toBeGreaterThan(0)
    for (const job of responseData.jobs) {
      expect(job.application_url.startsWith('https://')).toBe(true)
      expect(job.is_locked).toBe(false)
    }
  })

  it('Security Vector 3: Residual Session Data Leakage on User Logout', async () => {
    const store = new Map<string, string>()
    const mockStorage = {
      getItem: (k: string) => store.get(k) || null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear(),
    }
    vi.stubGlobal('localStorage', mockStorage)

    const { db, INITIAL_STUDENT } = await import('../src/services/db')

    // Simulate an authenticated user with private data
    const userProfile = {
      id: 'student_private_123',
      name: 'Private Candidate',
      email: 'private@university.edu',
      phone: '9988776655',
      college: 'Secret Institute',
      degree: 'B.Tech IT',
      graduation_year: 2025,
      skills: ['Python', 'SQL'],
      education_level: 'Undergraduate',
      experience_level: 'Fresher',
      preferred_categories: ['Software Development'],
      preferred_locations: ['Bengaluru'],
      preferred_work_mode: ['Remote'] as any,
    }

    db.saveStudent(userProfile)
    expect(db.getStudent().name).toBe('Private Candidate')
    expect(db.getStudent().email).toBe('private@university.edu')

    // Now execute session clearance on logout
    db.clearUserSession()

    // Must be purged to clean guest student state
    const loggedOutStudent = db.getStudent()
    expect(loggedOutStudent.id).toBe(INITIAL_STUDENT.id)
    expect(loggedOutStudent.name).toBe('')
    expect(loggedOutStudent.email).toBe('')
    expect(loggedOutStudent.phone).toBe('')
    expect(loggedOutStudent.college).toBe('')
    expect(loggedOutStudent.skills).toHaveLength(0)

    // Saved jobs and applications must also be empty
    expect(db.getSavedJobs(loggedOutStudent.id)).toHaveLength(0)
    expect(db.getApplications(loggedOutStudent.id)).toHaveLength(0)
  })
})
