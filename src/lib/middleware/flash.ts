import type { Request, Response, NextFunction } from 'express'

declare module 'express-session' {
  interface SessionData {
    flash?: { type: string; intro: string; message: string }
  }
}

export default function flash(req: Request, res: Response, next: NextFunction) {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  next()
}
