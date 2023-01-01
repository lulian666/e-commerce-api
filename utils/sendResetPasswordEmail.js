const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({ name, email, token, origin }) => {
    const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`
    return sendEmail({
        to: email,
        subject: 'Email Confirmation',
        html: `<h4>hi ${name}</h4><a>${resetURL}</a>`,
    })
}

module.exports = sendVerificationEmail
