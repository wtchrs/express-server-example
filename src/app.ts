import express from 'express'
import { create } from 'express-handlebars'

import { default as handlers, ApiHandlers as api } from './lib/handlers'
import weatherMiddleware from './lib/middleware/weather'

export const port: string | 3000 = process.env.PORT || 3000
export const root_dir = './'

const app = express()

app.disable('x-powered-by')

const hbs = create({
  extname: '.hbs',
  defaultLayout: 'main',
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

app.use(express.urlencoded({ extended: false }))
app.use(express.static(root_dir + '/public'))
app.use(weatherMiddleware)

app.get('/', handlers.home)
app.get('/about', handlers.about)

app.get('/section-test', handlers.sectionTest)

// API
app.get('/api/headers', api.showHeaders)

// custom 404, 500 handling pages
app.use(handlers.notFound)
app.use(handlers.serverError)

export default app
