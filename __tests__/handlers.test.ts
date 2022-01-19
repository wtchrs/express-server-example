import { mock } from 'jest-mock-extended'
import type { Request, Response } from 'express'

import { default as handlers, ApiHandlers as api } from '../src/lib/handlers'

describe('Rendering handlers tests', () => {
  test('home page renders', () => {
    const req = mock<Request>()
    const res = mock<Response>()

    handlers.home(req, res)

    expect(res.render).toHaveBeenCalledTimes(1)
    expect(res.render).toHaveBeenCalledWith('home')
  })

  test('about page renders with fortune', () => {
    const req = mock<Request>()
    const res = mock<Response>()

    handlers.about(req, res)

    expect(res.render).toHaveBeenCalledTimes(1)
    expect(res.render).toHaveBeenCalledWith(
      'about',
      expect.objectContaining({ fortune: expect.stringMatching(/\W/) }),
    )
  })

  test('section-test handler renders', () => {
    const req = mock<Request>()
    const res = mock<Response>()

    handlers.sectionTest(req, res)

    expect(res.render).toHaveBeenCalledTimes(1)
    expect(res.render).toHaveBeenCalledWith('section-test')
  })

  // TODO: vacation-photo contest page test

  test('404 handler renders', () => {
    const req = mock<Request>()
    const res = mock<Response>()

    handlers.notFound(req, res)

    expect(res.render).toHaveBeenCalledTimes(1)
    expect(res.render).toHaveBeenCalledWith('404')
  })

  test('500 handler renders', () => {
    const err = mock<Error>()
    const req = mock<Request>()
    const res = mock<Response>()
    const next = jest.fn()

    handlers.serverError(err, req, res, next)

    expect(res.render).toHaveBeenCalledTimes(1)
    expect(res.render).toHaveBeenCalledWith('500')
    expect(next).not.toHaveBeenCalled()
  })
})

describe('API handlers tests', () => {
  test('/api/headers handler test', () => {
    const req = mock<Request>()
    const res = mock<Response>()

    // dummy headers
    req.headers = {
      host: '127.0.0.1:3000',
      connection: 'keep-alive',
      etc: '...',
    }

    api.showHeaders(req, res)

    expect(res.type).toHaveBeenCalledTimes(1)
    expect(res.type).toHaveBeenCalledWith('text/plain')
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith(
      expect.stringMatching(/^([^\n]+: [^\n]+\n)+([^\n]+: [^\n]+)$/),
    )
  })
})
