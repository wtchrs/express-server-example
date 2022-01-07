import type { Request, Response, NextFunction } from 'express'

import { getFortune } from './fortune'

export function home(_req: Request, res: Response) {
  res.render('home')
}

export function about(_req: Request, res: Response) {
  res.render('about', { fortune: getFortune() })
}

export function notFound(_req: Request, res: Response) {
  res.status(404)
  res.render('404')
}

export function serverError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err)
  res.status(500)
  res.render('500')
}
