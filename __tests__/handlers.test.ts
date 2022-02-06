import { mock } from 'jest-mock-extended'
import type { Request, Response } from 'express'

import * as handlers from '../src/lib/handlers'

describe('Rendering handlers tests', () => {
    let req: Request
    let res: Response

    beforeEach(() => {
        req = mock<Request>()
        res = mock<Response>()
    })

    test('home page renders', () => {
        handlers.home(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith('home')
    })

    test('about page renders with fortune', () => {
        handlers.about(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith(
            'about',
            expect.objectContaining({ fortune: expect.stringMatching(/\W/) }),
        )
    })

    test('section-test renders', () => {
        handlers.sectionTest(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith('section-test')
    })

    test('newsletter sign up page renders', () => {
        handlers.newsletterSignup(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith(
            'newsletter-signup',
            expect.objectContaining({ csrf: expect.stringMatching(/\W/) }),
        )
    })

    test('newsletter sign up process with invalid email redirects to /newsletter', async () => {
        req.body = { name: 'test_name', email: 'this_is_invalid_email' }

        await handlers.newsletterSignupProcess(req, res)

        expect(res.redirect).toHaveBeenCalledTimes(1)
        expect(res.redirect).toHaveBeenCalledWith(303, '/newsletter')
    })

    test('newsletter sign up process with valid email redirects to /newsletter/archive', async () => {
        req.body = { name: 'hello', email: 'hello@hello.com' }

        await handlers.newsletterSignupProcess(req, res)

        expect(res.redirect).toHaveBeenCalledTimes(1)
        expect(res.redirect).toHaveBeenCalledWith(303, '/newsletter/archive')
    })

    test('newsletter archive page renders', () => {
        handlers.newsletterArchive(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith('newsletter-archive')
    })

    test('newsletter sign up with ajax renders', () => {
        handlers.newsletter(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith(
            'newsletter',
            expect.objectContaining({ csrf: expect.stringMatching(/\W/) }),
        )
    })

    test('vacation-photo participating page renders', () => {
        handlers.vacationPhotoContest(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith(
            'contest/vacation-photo',
            expect.objectContaining({ csrf: expect.stringMatching(/\W/) }),
        )
    })

    test('vacation-photo process redirects', () => {
        const fields = mock<unknown>()
        const files = mock<unknown>()

        handlers.vacationPhotoContestProcessHandler(req, res, fields, files)

        expect(res.redirect).toHaveBeenCalledTimes(1)
        expect(res.redirect).toHaveBeenCalledWith(
            303,
            '/contest/vacation-photo/thank-you',
        )
    })

    test('vacation-photo-thank-you page renders', () => {
        handlers.vacationPhotoContestThankYou(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith(
            'contest/vacation-photo-thank-you',
        )
    })

    test('vacation-photo participating page with ajax renders', () => {
        handlers.vacationPhotoContestAjax(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith(
            'contest/vacation-photo-ajax',
            expect.objectContaining({ csrf: expect.stringMatching(/\W/) }),
        )
    })

    test('404 handler renders', () => {
        handlers.notFound(req, res)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith('404')
    })

    test('500 handler renders', () => {
        const err = mock<Error>()
        const next = jest.fn()

        handlers.serverError(err, req, res, next)

        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith('500')
        expect(next).not.toHaveBeenCalled()
    })
})

describe('API handlers tests', () => {
    let req: Request
    let res: Response

    beforeEach(() => {
        req = mock<Request>()
        res = mock<Response>()
    })

    test('/api/headers handler test', () => {
        // dummy headers
        req.headers = {
            host: '127.0.0.1:3000',
            connection: 'keep-alive',
            etc: '...',
        }

        handlers.api.showHeaders(req, res)

        expect(res.type).toHaveBeenCalledTimes(1)
        expect(res.type).toHaveBeenCalledWith('text/plain')
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(
            expect.stringMatching(/^([^\n]+: [^\n]+\n)+([^\n]+: [^\n]+)$/),
        )
    })

    test('newsletter signup ajax test', async () => {
        req.body = {
            _csrf: 'CSRF token',
            name: 'Hello',
            email: 'hello@hello.com',
        }

        await handlers.api.newsletterSignup(req, res)

        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({ result: 'success' }),
        )
    })

    test('vacation-photo ajax handler test', () => {
        const fields = mock<unknown>()
        const files = mock<unknown>()

        handlers.api.vacationPhotoContestHandler(req, res, fields, files)

        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({ result: 'success' }),
        )
    })
})
