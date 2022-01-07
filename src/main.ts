import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import { create } from 'express-handlebars'

import { getFortune } from './lib/fortune'

const port: string | 3000 = process.env.PORT || 3000
const root_dir = './'

const app = express()

const hbs = create({
  extname: '.hbs',
  defaultLayout: 'main',
})
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

app.use(express.static(root_dir + '/public'))

app.get('/', (_req: Request, res: Response) => res.render('home'))

app.get('/about', (_req: Request, res: Response) => {
  res.render('about', { fortune: getFortune() })
})

app.use((_req: Request, res: Response) => {
  res.status(404)
  res.render('404')
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message)
  res.status(500)
  res.render('500')
})

app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl + C to terminate.`,
  ),
)
