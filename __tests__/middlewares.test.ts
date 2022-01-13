import { mock } from 'jest-mock-extended'
import type { Request, Response } from 'express'

import weatherMiddleware from '../src/lib/middleware/weather'

describe('Middleware tests', () => {
  test('Weather middleware', async () => {
    const req = mock<Request>()
    const res = mock<Response>()
    const next = jest.fn()

    await weatherMiddleware(req, res, next)

    expect(res.locals).toHaveProperty('partials.weatherContext')
    expect(next).toHaveBeenCalledTimes(1)
  })
})
