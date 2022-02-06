import { Request, Response } from 'express'
import { Product } from '../middleware/cartValidation'

/**
 * Dummy products data
 * @type {Product[]}
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
 * @param {Request} req
 * @param {Response} res
 */
export function cart(req: Request, res: Response) {
    const cart = req.session.cart || { items: [] }
    const context = { products, cart }
    res.render('cart', context)
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export function cartProcess(req: Request, res: Response) {
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
