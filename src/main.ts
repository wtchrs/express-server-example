import express from 'express'
import type { Request, Response, NextFunction } from 'express'

import { create } from 'express-handlebars'

const port: string | 3000 = process.env.PORT || 3000
const cdir = './'

const fortunes = [
  'Conquer your fears of they will conquer you.',
  'Rivers need springs.',
  "Do not fear what you don't know.",
  'You will have a pleasant surprise.',
  'Whenever possible, keep it simple.',
]

const app = express()

const hbs = create({
  extname: '.hbs',
  defaultLayout: 'main',
})
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

app.use(express.static(cdir + '/public'))

app.get('/', (_req: Request, res: Response) => res.render('home'))

app.get('/about', (_req: Request, res: Response) => {
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
  res.render('about', { fortune: randomFortune })
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
