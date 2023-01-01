const sendEmail = require('./sendEmail')

const sendVerificationemail = async ({
    name,
    email,
    verificationToken,
    origin,
}) => {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    return sendEmail({
        to: email,
        subject: 'Email Confirmation',
        html: `<h4>hi ${name}</h4><a>${verifyEmail}</a>`,
    })
}

module.exports = sendVerificationemail
