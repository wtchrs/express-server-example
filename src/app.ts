import express from 'express'
import type { Express } from 'express'
import { create } from 'express-handlebars'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import dotenv from 'dotenv'

import * as handlers from './lib/handlers'
import weatherMiddleware from './lib/middleware/weather'
import flashMiddleware from './lib/middleware/flash'
import * as cartValidation from './lib/middleware/cartValidation'

type Profile = 'development' | 'test' | 'production'

export const port = Number(process.env.PORT) || 3000
export const root_dir = './'

/**
 * Create a server application of express.
 *
 * @param {Profile} profile
 * @return {Express}
 */
export default function application(profile?: Profile): Express {
    if (profile === undefined) {
        profile = 'development'
    }

    dotenv.config({ path: root_dir + `/env/${profile}.env` })

    const app = express()
    app.disable('x-powered-by')

    const hbs = create({
        extname: '.hbs',
        defaultLayout: 'stellar',
        helpers: {
            section(name: string, options: { fn: (arg: unknown) => string }) {
                if (!this.sections) this.sections = {}

                const sections = this.sections as { [key: string]: unknown }

                sections[name] = options.fn(this)
                return null
            },
        },
    })

    app.engine('.hbs', hbs.engine)
    app.set('view engine', '.hbs')

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(express.static(root_dir + '/public'))

    app.use(cookieParser(process.env.cookieSecret))
    app.use(
        expressSession({
            resave: false,
            saveUninitialized: false,
            secret: process.env.cookieSecret || '',
        }),
    )

    app.use(weatherMiddleware)
    app.use(flashMiddleware)
    app.use(cartValidation.resetValidation)
    app.use(cartValidation.checkWaivers)
    app.use(cartValidation.checkGuestCounts)

    app.get('/', handlers.home)
    app.get('/about', handlers.about)

    app.get('/section-test', handlers.sectionTest)

    app.get('/newsletter-signup', handlers.newsletterSignup)
    app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
    app.get('/newsletter/archive', handlers.newsletterArchive)

    app.get('/newsletter', handlers.newsletter)

    app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
    app.post(
        '/contest/vacation-photo/:year/:month',
        handlers.vacationPhotoContestProcess,
    )
    app.get(
        '/contest/vacation-photo/thank-you',
        handlers.vacationPhotoContestThankYou,
    )

    app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax)

    app.get('/cart', handlers.cart)
    app.post('/cart/add-to-cart', handlers.cartProcess)

    // API
    app.get('/api/headers', handlers.api.showHeaders)
    app.post('/api/newsletter-signup', handlers.api.newsletterSignup)
    app.post(
        '/api/contest/vacation-photo-ajax/:year/:month',
        handlers.api.vacationPhotoContest,
    )

    // custom 404, 500 handling pages
    app.use(handlers.notFound)
    app.use(handlers.serverError)

    return app
}
