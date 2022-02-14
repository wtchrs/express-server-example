declare module 'express-session' {
    interface SessionData {
        cart?: ICart
        flash?: { type: string; intro: string; message: string }
    }
}

export interface ICart {
    items: IItem[]
    warnings?: string[]
    errors?: string[]
    number?: string
    billing?: IEmail
}

export interface IItem {
    product: IProduct
    guests: number
}

export interface IProduct {
    id: string
    name: string
    price: number
    requiresWaiver?: boolean
    maxGuests?: number
}

export interface IEmail {
    name: string
    email: string
}
