import type { Request, Response, NextFunction } from 'express'
import multiparty from 'multiparty'

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
    console.log('Form (from querystring): ' + req.query.form)
    console.log('CSRF token (from hidden form field): ' + req.body.csrf)
    console.log('Name (from visible form field): ' + req.body.name)
    console.log('Email (from visible form field): ' + req.body.email)

    res.redirect(303, '/newsletter-signup/thank-you')
  }

  static newsletterSignupThankYou(_req: Request, res: Response) {
    res.render('newsletter-signup-thank-you')
  }

  /**
   * Handlers for newsletter signup page with ajax.
   */
  static newsletter(_req: Request, res: Response) {
    res.render('newsletter', { csrf: 'CSRF token goes here' })
  }

  static vacationPhotoContest(_req: Request, res: Response) {
    const now = new Date()

    res.render('contest/vacation-photo', {
      csrf: 'CSRF token goes here',
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    })
  }

  static vacationPhotoContestProcess(req: Request, res: Response) {
    const form = new multiparty.Form()
    form.parse(req, (err: Error, field: unknown, files: unknown) => {
      if (err) {
        console.error(err)
        res.status(500).send({ error: err.message })
        return
      }

      Handlers.vacationPhotoContestProcessHandler(req, res, field, files)
    })
  }

  /**
   * Extracted for testing.
   * Using Handlers.vacationPhotoContestProcess instead of using this function.
   */
  static vacationPhotoContestProcessHandler(
    _req: Request,
    res: Response,
    fields: unknown,
    files: unknown,
  ) {
    console.log('field data: ', fields)
    console.log('files: ', files)

    res.redirect(303, '/contest/vacation-photo-thank-you')
  }

  static vacationPhotoContestThankYou(_req: Request, res: Response) {
    res.render('contest/vacation-photo-thank-you')
  }

  /**
   * Handlers for vacation photo contest page with ajax.
   */
  static vacationPhotoContestAjax(req: Request, res: Response) {
    res.render('contest/vacation-photo-ajax', { csrf: 'CSRF token goes here' })
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

  static vacationPhotoContest(req: Request, res: Response) {
    const form = new multiparty.Form()
    form.parse(req, (err: Error, fields: unknown, files: unknown) => {
      if (err) {
        console.error(err)
        res.status(500).send({ error: err.message })
        return
      }

      ApiHandlers.vacationPhotoContestHandler(req, res, fields, files)
    })
  }

  /**
   * Extracted for testing.
   * Using ApiHandlers.vacationPhotoContest instead of using this function.
   */
  static vacationPhotoContestHandler(
    _req: Request,
    res: Response,
    fields: unknown,
    files: unknown,
  ) {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.send({ result: 'success' })
  }
}
