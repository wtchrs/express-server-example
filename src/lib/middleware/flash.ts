import type { Request, Response, NextFunction } from 'express'

/**
 * Middleware for flash message.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export default function flash(req: Request, res: Response, next: NextFunction) {
    if (req.session.flash) {
        res.locals.flash = req.session.flash
        delete req.session.flash
    }

    next()
}
