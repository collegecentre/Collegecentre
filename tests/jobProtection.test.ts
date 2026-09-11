import { describe, it, expect } from 'vitest'
import { getProtectedJobs } from '../server/jobsHandler.js'

describe('Protected Job Discovery & Server-Side Redaction', () => {
  it('redacts sensitive details for jobs #4+ when user has no pass', async () => {
    let responseData: any = null
    let responseStatus: number = 200

    const mockReq: any = {
      method: 'GET',
      headers: {}, // No auth token -> unauthenticated free user
    }

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

    expect(responseStatus).toBe(200)
    expect(responseData.success).toBe(true)
    expect(responseData.userHasPass).toBe(false)
    expect(responseData.jobs.length).toBeGreaterThan(3)

    // Top 3 preview jobs MUST NOT be locked
    for (let i = 0; i < 3; i++) {
      expect(responseData.jobs[i].is_locked).toBe(false)
      expect(responseData.jobs[i].application_url).toBeTruthy()
      expect(responseData.jobs[i].company).not.toBe('[Verified Top Employer]')
    }

    // Jobs 4+ MUST BE REDACTED on the server
    for (let i = 3; i < responseData.jobs.length; i++) {
      const lockedJob = responseData.jobs[i]
      expect(lockedJob.is_locked).toBe(true)
      expect(lockedJob.company).toBe('[Verified Top Employer]')
      expect(lockedJob.application_url).toBe('') // Application URL must NEVER leak over wire!
      expect(lockedJob.salary).toContain('Locked')
    }
  })

  it('rejects unsupported HTTP methods with 405 Method Not Allowed', async () => {
    let responseStatus = 200
    let responseData: any = null

    const mockReq: any = { method: 'POST', headers: {} }
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
})
