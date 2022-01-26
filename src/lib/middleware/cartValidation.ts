import type { Request, Response, NextFunction } from 'express'

declare module 'express-session' {
    interface SessionData {
        cart?: Cart
    }
}

export interface Cart {
    warnings?: string[]
    errors?: string[]
    items: Item[]
}

export interface Item {
    product: Product
    guests: number
}

export interface Product {
    id: string
    name: string
    price: number
    requiresWaiver?: boolean
    maxGuests?: number
}

/**
 * Middlewares for check validation of a cart.
 */
export default class CartValidation {
    static resetValidation(req: Request, res: Response, next: NextFunction) {
        const { cart } = req.session

        if (cart) {
            cart.warnings = []
            cart.errors = []
        }

        next()
    }

    static checkWaivers(req: Request, res: Response, next: NextFunction) {
        const { cart } = req.session

        if (!cart) {
            next()
            return
        }

        cart.warnings = cart.warnings || []

        if (cart.items.some(item => item.product.requiresWaiver)) {
            cart.warnings.push(
                'One or more of your selected tours requires a waiver.',
            )
        }

        next()
    }

    static checkGuestCounts(req: Request, res: Response, next: NextFunction) {
        const { cart } = req.session
        if (!cart) {
            next()
            return
        }

        cart.errors = cart.errors || []

        const check = (item: Item) =>
            item.guests > (item.product.maxGuests || Number.MAX_VALUE)

        if (cart.items.some(check)) {
            cart.errors.push(
                'One or more of your selected tours cannot accommodate the number of' +
                    ' guests you have selected.',
            )
        }

        next()
    }
}
