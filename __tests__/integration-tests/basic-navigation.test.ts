import portfinder from 'portfinder'
import puppeteer from 'puppeteer'
import type { Browser, Page } from 'puppeteer'

import type { Server } from 'http'

import app from '../../src/app'

describe('Navigation test', () => {
    let server: Server | null = null
    let port: number | null = null

    jest.setTimeout(10000)

    beforeEach(async () => {
        port = await portfinder.getPortPromise()
        server = app.listen(port)
    })

    afterEach(() => {
        if (server) server.close()
    })

    test('home page links to about page', async () => {
        const browser: Browser = await puppeteer.launch()
        const page: Page = await browser.newPage()

        await page.goto(`http://localhost:${port}`)
        await Promise.all([
            page.waitForNavigation(),
            page.click('[data-test-id="about"]'),
        ])

        expect(page.url()).toBe(`http://localhost:${port}/about`)

        await browser.close()
    })
})
