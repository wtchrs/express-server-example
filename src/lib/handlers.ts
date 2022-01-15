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

  static newsletterSignup(_req: Request, res: Response) {
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
  }

  static newsletterSignupProcess(req: Request, res: Response) {
    console.log('Form (fromquerystring): ' + req.query.form)
    console.log('CSRF token (from hidden form field): ' + req.body.csrf)
    console.log('Name (from visible form field): ' + req.body.name)
    console.log('Email (from visible form field): ' + req.body.email)
    res.redirect(303, '/newsletter-signup/thank-you')
  }

  static newsletterSignupThankYou(_req: Request, res: Response) {
    res.render('newsletter-signup-thank-you')
  }

  static newsletter(_req: Request, res: Response) {
    res.render('newsletter', { csrf: 'CSRF token goes here' })
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

  static newsletterSignup(req: Request, res: Response) {
    console.log('CSRF token (from hidden form field): ' + req.body.csrf)
    console.log('Name (from visible form field): ' + req.body.name)
    console.log('Email (from visible form field): ' + req.body.email)
    res.send({ result: 'success' })
  }
}
