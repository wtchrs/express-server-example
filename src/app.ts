import express from 'express'
import { create } from 'express-handlebars'

import * as handlers from './lib/handlers'

export const port: string | 3000 = process.env.PORT || 3000
export const root_dir = './'

const app = express()

const hbs = create({
  extname: '.hbs',
  defaultLayout: 'main',
})
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

app.use(express.static(root_dir + '/public'))

app.get('/', handlers.home)
app.get('/about', handlers.about)

// custom 404, 500 handling pages
app.use(handlers.notFound)
app.use(handlers.serverError)

export default app
