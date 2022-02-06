const form = document.getElementById('newsletterSignupForm')

form.addEventListener('submit', evt => {
    evt.preventDefault()

    const form = evt.target
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        name: form.elements.name.value,
        email: form.elements.email.value,
    })
    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('newsletterSignupFormContainer')

    fetch('/api/newsletter-signup', { method: 'post', body, headers })
        .then(res => {
            if (res.status < 200 || res.status >= 300)
                throw new Error(`Request failed with status ${res.status}`)
            return res.json()
        })
        .then(json => {
            if (json.result !== 'success') {
                container.innerHTML =
                    "<p>We're sorry, we had a problem signing you up.</p>" +
                    `<p>message : <strong>${json.message}</strong></p>`
                return
            }
            container.innerHTML =
                '<b>Thank you for signing up!</b><p><a href="/">Home</a></p>'
        })
        .catch(err => {
            container.innerHTML =
                "<b>We're sorry, we had a problem signing you up. " +
                'Please <a href="/newsletter">try again</a>.'
        })
})
