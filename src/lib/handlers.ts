import type { Request, Response, NextFunction } from 'express'
import multiparty from 'multiparty'

import { getFortune } from './fortune'
import type { Product } from './middleware/cartValidation'

const VALID_EMAIL_REGEX = new RegExp(
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',
)

/**
 * Dummy products data
 */
const products: Product[] = [
  {
    id: 'hPc8YUbFuZM9edw4DaxwHk',
    name: 'Rock Climbing Expedition in Bend',
    price: 239.95,
    requiresWaiver: true,
  },
  {
    id: 'eyryDtCCu9UUcqe9XgjbRk',
    name: 'Walking Tour of Portland',
    price: 89.95,
  },
  {
    id: '6oC1Akf6EbcxWZXHQYNFwx',
    name: 'Manzanita Surf Expedition',
    price: 159.95,
    maxGuests: 6,
  },
  {
    id: 'w6wTWMx39zcBiTdpM9w5J7',
    name: 'Wine Tasting in the Willamette Valley',
    price: 229.95,
  },
]

/**
 * Save signup data.
 */
class NewsletterSignup {
  readonly name: string
  readonly email: string

  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }

  async save() {
    console.log(`name: ${this.name}`)
    console.log(`email: ${this.email}`)
  }
}

/**
 * Helper class for rendering handlers.
 */
export default class Handlers {
  static home(_req: Request, res: Response) {
    res.cookie('monster', 'nom nom')
    res.cookie('signed_monster', 'nom nom', { signed: true })
    res.render('home')
  }

  static about(_req: Request, res: Response) {
    res.render('about', { fortune: getFortune() })
  }

  static sectionTest(_req: Request, res: Response) {
    res.render('section-test')
  }

  static newsletterSignup(_req: Request, res: Response) {
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
  }

  static newsletterSignupProcess(req: Request, res: Response) {
    const name = req.body.name || ''
    const email = req.body.email || ''

    if (!VALID_EMAIL_REGEX.test(email)) {
      req.session.flash = {
        type: 'danger',
        intro: 'Validation error!',
        message: 'The email address you entered was not valid.',
      }

      res.redirect(303, '/newsletter')
      return
    }

    new NewsletterSignup(name, email)
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

  static newsletterArchive(_req: Request, res: Response) {
    res.render('newsletter-archive')
  }

  /**
   * Handlers for newsletter signup page with ajax.
   */
  static newsletter(_req: Request, res: Response) {
    res.render('newsletter', { csrf: 'CSRF token goes here' })
  }

  static vacationPhotoContest(_req: Request, res: Response) {
    const now = new Date()

    res.render('contest/vacation-photo', {
      csrf: 'CSRF token goes here',
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    })
  }

  static vacationPhotoContestProcess(req: Request, res: Response) {
    const form = new multiparty.Form()
    form.parse(req, (err: Error, field: unknown, files: unknown) => {
      if (err) {
        console.error(err)
        res.status(500).send({ error: err.message })
        return
      }

      Handlers.vacationPhotoContestProcessHandler(req, res, field, files)
    })
  }

  /**
   * Extracted for testing.
   * Using Handlers.vacationPhotoContestProcess instead of using this function.
   */
  static vacationPhotoContestProcessHandler(
    _req: Request,
    res: Response,
    fields: unknown,
    files: unknown,
  ) {
    console.log('field data: ', fields)
    console.log('files: ', files, '\n')

    res.redirect(303, '/contest/vacation-photo/thank-you')
  }

  static vacationPhotoContestThankYou(_req: Request, res: Response) {
    res.render('contest/vacation-photo-thank-you')
  }

  /**
   * Handlers for vacation photo contest page with ajax.
   */
  static vacationPhotoContestAjax(req: Request, res: Response) {
    res.render('contest/vacation-photo-ajax', {
      csrf: 'CSRF token goes here',
    })
  }

  static notFound(_req: Request, res: Response) {
    res.status(404)
    res.render('404')
  }

  static serverError(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    console.error(err)
    res.status(500)
    res.render('500')
  }

  static cart(req: Request, res: Response) {
    const cart = req.session.cart || { items: [] }
    const context = { products, cart }
    res.render('cart', context)
  }

  static cartProcess(req: Request, res: Response) {
    type ProdById = { [index: string]: Product }

    if (!req.session.cart) {
      req.session.cart = { items: [] }
    }

    const { cart } = req.session

    Object.keys(req.body).forEach(key => {
      if (!key.startsWith('guests-')) {
        return
      }

      const productId = key.split('-')[1]
      const productsById = products.reduce(
        (byId, prod) => Object.assign(byId, { [prod.id]: prod }),
        {} as ProdById,
      )
      const product = productsById[productId]
      const guests = Number(req.body[key])

      if (guests === 0) {
        return
      }

      if (!cart.items.some(item => item.product.id === productId)) {
        cart.items.push({ product, guests: 0 })
      }
      const idx = cart.items.findIndex(item => item.product.id == productId)
      const item = cart.items[idx]
      item.guests += guests
      if (item.guests < 0) item.guests = 0
      if (item.guests === 0) cart.items.splice(idx, 1)
    })

    res.redirect('/cart')
  }
}

/**
 * Helper class for API handlers.
 */
export class ApiHandlers {
  static showHeaders(req: Request, res: Response) {
    res.type('text/plain')

    const headers = Object.entries(req.headers).map(
      ([key, value]) => `${key}: ${value}`,
    )

    res.send(headers.join('\n'))
  }

  static newsletterSignup(req: Request, res: Response) {
    console.log(`CSRF token (from hidden form field): ${req.body._csrf}`)
    console.log(`Name (from visible form field): ${req.body.name}`)
    console.log(`Email (from visible form field): ${req.body.email}\n`)

    res.send({ result: 'success' })
  }

  static vacationPhotoContest(req: Request, res: Response) {
    const form = new multiparty.Form()
    form.parse(req, (err: Error, fields: unknown, files: unknown) => {
      if (err) {
        console.error(err)
        res.status(500).send({ error: err.message })
        return
      }

      ApiHandlers.vacationPhotoContestHandler(req, res, fields, files)
    })
  }

  /**
   * Extracted for testing.
   * Using ApiHandlers.vacationPhotoContest instead of using this function.
   */
  static vacationPhotoContestHandler(
    _req: Request,
    res: Response,
    fields: unknown,
    files: unknown,
  ) {
    console.log('field data: ', fields)
    console.log('files: ', files, '\n')

    res.send({ result: 'success' })
  }
}
