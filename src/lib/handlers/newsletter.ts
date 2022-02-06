import { Request, Response } from 'express'

const VALID_EMAIL_REGEX = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
        '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
        '(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',
)

/**
 * Save signup data.
 */
export class NewsletterSignup {
    readonly name: string
    readonly email: string

    private constructor(name: string, email: string) {
        this.name = name
        this.email = email
    }

    /**
     * Make a new NewsletterSignup instance.
     * It returns undefined when email is incorrect format.
     *
     * @param {string} name
     * @param {string} email
     * @return {(NewsletterSignup| undefined)}
     */
    static makeNewsletterSignup(
        name: string,
        email: string,
    ): NewsletterSignup | undefined {
        name = name || ''
        email = email || ''

        if (!VALID_EMAIL_REGEX.test(email)) {
            return undefined
        }

        return new NewsletterSignup(name, email)
    }

    /**
     * Save name and email with callback function.
     * Without callback, it just prints name and email with console.log.
     * @return {Promise<void>}
     */
    async save(): Promise<void>

    /**
     * Save name and email with callback function.
     * @param {(name: string, email: string) => Promise<void>} callback
     * @return {Promise<void>}
     */
    async save(
        callback: (name: string, email: string) => Promise<void>,
    ): Promise<void>

    async save(
        callback?: (name: string, email: string) => Promise<void>,
    ): Promise<void> {
        if (!callback) {
            console.log(`name: ${this.name}`)
            console.log(`email: ${this.email}`)
        } else {
            await callback(this.name, this.email)
        }
    }
}

/**
 * @param {Request} _req
 * @param {Response} res
 */
export function newsletterSignup(_req: Request, res: Response) {
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export async function newsletterSignupProcess(req: Request, res: Response) {
    const signup = NewsletterSignup.makeNewsletterSignup(
        req.body.name,
        req.body.email,
    )

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
        .save()
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
    res.render('newsletter-archive')
}

/**
 * Handlers for newsletter signup page with ajax.
 * @param {Request} _req
 * @param {Response} res
 */
export function newsletter(_req: Request, res: Response) {
    res.render('newsletter', { csrf: 'CSRF token goes here' })
}
