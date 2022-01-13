import type { Request, Response, NextFunction } from 'express'

import { getFortune } from './fortune'

/**
 * Helper class for rendering handlers.
 */
export default class Handlers {
  static home(_req: Request, res: Response) {
    res.render('home')
  }

  static about(_req: Request, res: Response) {
    res.render('about', { fortune: getFortune() })
  }

  static sectionTest(_req: Request, res: Response) {
    res.render('section-test')
  }

  static notFound(_req: Request, res: Response) {
    res.status(404)
    res.render('404')
  }

  static serverError(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    console.error(err)
    res.status(500)
    res.render('500')
  }
}

/**
 * Helper class for API handlers.
 */
export class ApiHandlers {
  static showHeaders(req: Request, res: Response) {
    res.type('text/plain')

    const headers = Object.entries(req.headers).map(
      ([key, value]) => `${key}: ${value}`,
    )

    res.send(headers.join('\n'))
  }
}
