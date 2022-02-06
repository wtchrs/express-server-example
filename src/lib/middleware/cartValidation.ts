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
 * Middleware to reset cart validation in request session.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function resetValidation(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { cart } = req.session

    if (cart) {
        cart.warnings = []
        cart.errors = []
    }

    next()
}

/**
 * Middleware to check requirements of waivers in cart.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function checkWaivers(req: Request, res: Response, next: NextFunction) {
    const { cart } = req.session

    if (cart === undefined) {
        next()
        return
    }

    if (cart.warnings === undefined) {
        cart.warnings = []
    }

    if (cart.items.some(item => item.product.requiresWaiver)) {
        cart.warnings.push(
            'One or more of your selected tours requires a waiver.',
        )
    }

    next()
}

/**
 * Middleware to check if the number of guests exceeds maxGuests.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function checkGuestCounts(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { cart } = req.session

    if (cart === undefined) {
        next()
        return
    }

    if (cart.errors === undefined) {
        cart.errors = []
    }

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
