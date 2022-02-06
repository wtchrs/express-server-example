import { Request, Response } from 'express'
import multiparty from 'multiparty'

/**
 * @param {Request} _req
 * @param {Response} res
 */
export function vacationPhotoContest(_req: Request, res: Response) {
    const now = new Date()

    res.render('contest/vacation-photo', {
        csrf: 'CSRF token goes here',
        year: now.getFullYear(),
        month: now.getMonth() + 1,
    })
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export function vacationPhotoContestProcess(req: Request, res: Response) {
    const form = new multiparty.Form()
    form.parse(req, (err: Error, field: unknown, files: unknown) => {
        if (err) {
            console.error(err)
            res.status(500).send({ error: err.message })
            return
        }

        vacationPhotoContestProcessHandler(req, res, field, files)
    })
}

/**
 * Extracted for testing.
 * Using Handlers.vacationPhotoContestProcess instead of using this function.
 *
 * @param {Request} _req
 * @param {Response} res
 * @param fields
 * @param files
 */
export function vacationPhotoContestProcessHandler(
    _req: Request,
    res: Response,
    fields: unknown,
    files: unknown,
) {
    console.log('field data: ', fields)
    console.log('files: ', files, '\n')

    res.redirect(303, '/contest/vacation-photo/thank-you')
}

/**
 * @param {Request} _req
 * @param {Request} res
 */
export function vacationPhotoContestThankYou(_req: Request, res: Response) {
    res.render('contest/vacation-photo-thank-you')
}

/**
 * Handlers for vacation photo contest page with ajax.
 *
 * @param {Request} req
 * @param {Response} res
 */
export function vacationPhotoContestAjax(req: Request, res: Response) {
    res.render('contest/vacation-photo-ajax', {
        csrf: 'CSRF token goes here',
    })
}
