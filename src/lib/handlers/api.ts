import { Request, Response } from 'express'
import multiparty from 'multiparty'

import { NewsletterSignup } from './newsletter'

/**
 * @param {Request} req
 * @param {Response} res
 */
export function showHeaders(req: Request, res: Response) {
    res.type('text/plain')

    const headers = Object.entries(req.headers).map(
        ([key, value]) => `${key}: ${value}`,
    )

    res.send(headers.join('\n'))
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export async function newsletterSignup(req: Request, res: Response) {
    const signup = NewsletterSignup.makeNewsletterSignup(
        req.body.name,
        req.body.email,
    )

    if (signup === undefined) {
        res.send({ result: 'error', message: 'Incorrect email format' })
        return
    }

    await signup
        .save()
        .then(() => {
            res.send({ result: 'success' })
        })
        .catch((err: Error) => {
            console.error(err)
            res.redirect(500, '500')
        })
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export function vacationPhotoContest(req: Request, res: Response) {
    const form = new multiparty.Form()
    form.parse(req, (err: Error, fields: unknown, files: unknown) => {
        if (err) {
            console.error(err)
            res.status(500).send({ error: err.message })
            return
        }
        vacationPhotoContestHandler(req, res, fields, files)
    })
}

/**
 * Extracted for testing.
 * Using ApiHandlers.vacationPhotoContest instead of using this function.
 *
 * @param {Request} _req
 * @param {Response} res
 * @param fields
 * @param files
 */
export function vacationPhotoContestHandler(
    _req: Request,
    res: Response,
    fields: unknown,
    files: unknown,
) {
    console.log('field data: ', fields)
    console.log('files: ', files, '\n')

    res.send({ result: 'success' })
}
