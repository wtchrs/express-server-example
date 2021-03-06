/** @type {string[]} */
const fortuneCookies = [
    'Conquer your fears of they will conquer you.',
    'Rivers need springs.',
    "Do not fear what you don't know.",
    'You will have a pleasant surprise.',
    'Whenever possible, keep it simple.',
]

/**
 * Return a random fortune cookie message.
 * @return {string}
 */
export function getFortune(): string {
    const idx = Math.floor(Math.random() * fortuneCookies.length)
    return fortuneCookies[idx]
}
