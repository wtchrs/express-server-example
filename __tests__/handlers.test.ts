import { mock } from 'jest-mock-extended'
import type { Request, Response } from 'express'

import * as handlers from '../src/lib/handlers'

describe('Server test', () => {
  test('home page renders', () => {
    const req = mock<Request>()
    const res = mock<Response>()

    handlers.home(req, res)

    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('home')
  })

  test('about page renders with fortune', () => {
    const req = mock<Request>()
    const res = mock<Response>()

    handlers.about(req, res)

    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('about')
    expect(res.render.mock.calls[0][1]).toEqual(
      expect.objectContaining({ fortune: expect.stringMatching(/\W/) }),
    )
  })

  test('404 handler renders', () => {
    const req = mock<Request>()
    const res = mock<Response>()

    handlers.notFound(req, res)

    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('404')
  })

  test('500 handler renders', () => {
    const err = mock<Error>()
    const req = mock<Request>()
    const res = mock<Response>()
    const next = jest.fn()

    handlers.serverError(err, req, res, next)

    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('500')
    expect(next.mock.calls.length).toBe(0)
  })
})
