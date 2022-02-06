import { default as application, port } from './app'

const app = application()

app.listen(port, '0.0.0.0', () =>
    console.log(
        `Express started on http://localhost:${port}; ` +
            `press Ctrl + C to terminate.\n`,
    ),
)
