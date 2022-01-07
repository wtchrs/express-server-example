import { default as app, port } from './app'

app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl + C to terminate.`,
  ),
)
