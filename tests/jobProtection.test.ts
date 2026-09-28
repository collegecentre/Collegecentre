import { describe, it, expect } from 'vitest'
import { getProtectedJobs } from '../server/jobsHandler.js'

describe('100% Free Job Discovery API', () => {
  it('returns all jobs unmasked with direct application links without requiring payment or pass', async () => {
    let responseData: any = null
    let responseStatus: number = 200

    const mockReq: any = {
      method: 'GET',
      headers: {}, // No auth token needed for discovery
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
    expect(responseData.jobs.length).toBeGreaterThan(0)

    // ALL jobs MUST be completely unlocked with direct links
    for (const job of responseData.jobs) {
      expect(job.is_locked).toBe(false)
      expect(job.application_url).toBeTruthy()
      expect(job.company).not.toBe('[Verified Top Employer]')
      expect(job.salary).not.toContain('Locked')
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
