import { Request, Response } from 'express'
import { EmailProcess } from '../emailService'

/**
 * @param {Request} _req
 * @param {Response} res
 */
export function newsletterSignup(_req: Request, res: Response) {
    res.render('newsletter/signup', { csrf: 'CSRF token goes here' })
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export async function newsletterSignupProcess(req: Request, res: Response) {
    const signup = EmailProcess.makeEmailProcess(req.body.name, req.body.email)

    if (signup === undefined) {
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid.',
        }

        res.redirect(303, '/newsletter')
        return
    }

    await signup
        .process()
        .then(() => {
            req.session.flash = {
                type: 'success',
                intro: 'Thank you!',
                message: 'You have now been signed up for the newsletter.',
            }
            res.redirect(303, '/newsletter/archive')
        })
        .catch((_err: Error) => {
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.',
            }
            res.redirect(303, '/newsletter/archive')
        })
}

/**
 * @param {Request} _req
 * @param {Response} res
 */
export function newsletterArchive(_req: Request, res: Response) {
    res.render('newsletter/archive')
}

/**
 * Handlers for newsletter signup page with ajax.
 * @param {Request} _req
 * @param {Response} res
 */
export function newsletter(_req: Request, res: Response) {
    res.render('newsletter/newsletter', { csrf: 'CSRF token goes here' })
}
