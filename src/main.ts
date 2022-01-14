import { default as app, port } from './app'

app.listen(port, '0.0.0.0', () =>
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl + C to terminate.`,
  ),
)
