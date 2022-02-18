import sgMail from '@sendgrid/mail'
import { htmlToText } from 'html-to-text'
import type { IEmail } from './types'

/** Check email validation. */
export class EmailData implements IEmail {
    readonly name: string
    readonly email: string

    private static readonly VALID_EMAIL_REGEX = new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
            '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
            '(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',
    )

    /**
     * @param {string} name
     * @param {string} email
     * @private
     */
    private constructor(name: string, email: string) {
        this.name = name
        this.email = email
    }

    /**
     * Make a new EmailBase instance.
     * It returns undefined when email is incorrect format.
     *
     * @param {string} name
     * @param {string} email
     * @return {(EmailData | undefined)}
     */
    static makeEmailData(name: string, email: string): EmailData | undefined {
        name = name || ''
        email = email || ''

        if (!this.VALID_EMAIL_REGEX.test(email)) {
            return undefined
        }

        return new this(name, email)
    }
}

type CallbackWithEmail = (name: string, email: string) => unknown

/** Process with an instance of EmailData. */
export class EmailProcess {
    private emailData: EmailData
    private readonly callback: CallbackWithEmail

    /**
     * @param {EmailData} emailData
     * @param {(name: string, email: string) => unknown} callback
     * @private
     */
    private constructor(emailData: EmailData, callback: CallbackWithEmail) {
        this.emailData = emailData
        this.callback = callback
    }

    /**
     * Make a new EmailProcess instance.
     * It returns undefined when email is incorrect format.
     *
     * @param {string} name
     * @param {string} email
     * @param {((name: string, email: string) => unknown)=} callback
     */
    static makeEmailProcess(
        name: string,
        email: string,
        callback?: CallbackWithEmail,
    ): EmailProcess | undefined {
        const emailData = EmailData.makeEmailData(name, email)

        if (emailData === undefined) {
            return undefined
        }

        if (callback === undefined) {
            callback = (name, email) => {
                console.log(`name: ${name}`)
                console.log(`email: ${email}`)
            }
        }

        return new this(emailData, callback)
    }

    /** Process with callback. */
    async process() {
        await this.callback(this.emailData.name, this.emailData.email)
    }
}

export class EmailService {
    private static sender: string | EmailData

    /**
     * Not allowed to create a new instance.
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    /**
     * Set API key.
     * @param {string} apiKey
     */
    static setApiKey(apiKey: string) {
        sgMail.setApiKey(apiKey)
    }

    /**
     * Set an email sender data.
     * @param {string|EmailData} sender - It can be an email only string or an EmailData instance.
     */
    static setSender(sender: string | EmailData) {
        if (sender instanceof EmailData) {
            this.sender = sender
        } else {
            if (EmailData.makeEmailData('', sender) === undefined)
                throw new Error('Email validation error.')

            this.sender = sender
        }
    }

    /**
     * Send email with args.
     *
     * @param {string} to
     * @param {string} subject
     * @param {string} html
     */
    static async send(to: string, subject: string, html: string) {
        await sgMail
            .send({
                to,
                from: this.sender,
                subject,
                html,
                text: htmlToText(html),
            })
            .then(() => console.log('Email sent.'))
            .catch(err => console.error(err))
    }
}
