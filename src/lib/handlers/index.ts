import type { Request, Response, NextFunction } from 'express'

import { getFortune } from '../fortune'

/**
 * @param {Request} _req
 * @param {Response} res
 */
export function home(_req: Request, res: Response) {
    res.cookie('monster', 'nom nom')
    res.cookie('signed_monster', 'nom nom', { signed: true })
    res.render('home')
}

/**
 * @param {Request} _req
 * @param {Response} res
 */
export function about(_req: Request, res: Response) {
    res.render('about', { fortune: getFortune() })
}

/**
 * @param {Request} _req
 * @param {Response} res
 */
export function sectionTest(_req: Request, res: Response) {
    res.render('section-test')
}

/**
 * Custom 404 page handler
 *
 * @param {Request} _req
 * @param {Response} res
 */
export function notFound(_req: Request, res: Response) {
    res.status(404)
    res.render('404')
}

/**
 * Custom 500 page handler
 *
 * @param {Error} err
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} _next
 */
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

export * from './newsletter'
export * from './vacationPhotoContest'
export * from './cart'
export * as api from './api'
