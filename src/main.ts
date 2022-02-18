import { default as application, port } from './app'

const app = application()

app.listen(port, '0.0.0.0', () =>
    console.log(
        `Express started in ${app.get('env')} mode ` +
            `at http://localhost:${port}; ` +
            'press Ctrl + C to terminate.\n',
    ),
)
