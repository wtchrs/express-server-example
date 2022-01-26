const form = document.getElementById('vacationPhotoContestForm')

form.addEventListener('submit', evt => {
    evt.preventDefault()

    const body = new FormData(evt.target)
    const container = form.parentNode

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    fetch(`/api/contest/vacation-photo-ajax/${year}/${month}`, {
        method: 'post',
        body,
    })
        .then(res => {
            if (res.status < 200 || res.status >= 300)
                throw new Error(`Request failed with status ${res.status}`)
            return res.json()
        })
        .then(_json => {
            container.innerHTML =
                '<b>Thank you for submitting your photo</b><p><a href="/">Home</a></p>'
        })
        .catch(_err => {
            container.innerHTML =
                "<b>We're sorry, we had a problem processing your submission. " +
                'Please <a href="/contest/vacation-photo-ajax">try again</a>.'
        })
})
