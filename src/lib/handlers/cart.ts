import { Request, Response, NextFunction } from 'express'
import { EmailData, EmailService } from '../emailService'

import { ICart, IEmail, IProduct } from '../types'

/**
 * Dummy products data
 * @type {IProduct[]}
 */
const products: IProduct[] = [
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
 * @param {Request} req
 * @param {Response} res
 */
export function cart(req: Request, res: Response) {
    const cart = req.session.cart || { items: [] }
    const context = { products, cart }
    res.render('cart/cart', context)
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export function cartProcess(req: Request, res: Response) {
    type ProdById = { [index: string]: IProduct }

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

/**
 * @param req
 * @param res
 * @param next
 */
export function cartCheckout(req: Request, res: Response, next: NextFunction) {
    const cart = req.session.cart

    if (cart === undefined) {
        next(new Error('Cart does not exist.'))
        return
    }

    res.render('cart/checkout', { products, cart })
}

/**
 * @param req
 * @param res
 * @param next
 */
export function cartCheckoutProcess(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const cart = req.session.cart
    if (cart === undefined) {
        next(new Error('Cart does not exist.'))
        return
    }

    const name = req.body.name
    const email = req.body.email

    const customer_email = EmailData.makeEmailData(name, email)

    if (customer_email === undefined) {
        next(new Error('Invalid email address.'))
        return
    }

    // TODO: Replace with database ID.
    cart.number = Math.random()
        .toString()
        .replace(/^0\.0*/, '')
    cart.billing = { name: name, email: email }

    res.render(
        'email/cart-thank-you',
        { layout: 'email', cart: cart },
        checkoutEmailProcess(req, res, cart),
    )
}

function checkoutEmailProcess(req: Request, res: Response, cart: ICart) {
    return (err: Error, html: string) => {
        if (err) {
            console.error('error in email template.')
            return
        }

        const sender = EmailData.makeEmailData(
            process.env.SENDER_NAME as string,
            process.env.SENDER_EMAIL as string,
        )

        if (sender === undefined) {
            console.error('Email data of email sender is invalid.')
            return
        }

        const emailService = new EmailService(sender)

        emailService
            .send(
                (cart.billing as IEmail).email,
                'Thank you for book your trip with Meadowlark Travel',
                html,
            )
            .then(() => {
                res.render('cart/thank-you', { cart: cart })
                delete req.session.cart
            })
            .catch(err =>
                console.error('Unable to send confirmation: ' + err.message),
            )
    }
}
