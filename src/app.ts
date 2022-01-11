import express from 'express'
import { create } from 'express-handlebars'

import { default as handlers, ApiHandlers as api } from './lib/handlers'

export const port: string | 3000 = process.env.PORT || 3000
export const root_dir = './'

const app = express()

app.disable('x-powered-by')

const hbs = create({
  extname: '.hbs',
  defaultLayout: 'main',
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

app.use(express.urlencoded({ extended: false }))

app.use(express.static(root_dir + '/public'))

app.get('/', handlers.home)
app.get('/about', handlers.about)

// API
app.get('/api/headers', api.showHeaders)

// custom 404, 500 handling pages
app.use(handlers.notFound)
app.use(handlers.serverError)

export default app
