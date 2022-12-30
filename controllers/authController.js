const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createJWT, attachCookiesToResponse } = require('../utils')

const register = async (req, res) => {
    const { email, name, password } = req.body
    const hasAnyAccount = await User.countDocuments({})
    const role = hasAnyAccount ? 'user' : 'admin'
    const user = await User.create({ email, name, password, role })

    const tokenUser = { userId: user._id, name: user.name, role: user.role }
    attachCookiesToResponse({ res, user: tokenUser })

    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}
const login = async (req, res) => {
    const { email, password } = req.body
    console.log('req.body', req.body)
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }

    const tokenUser = { userId: user._id, name: user.name, role: user.role }
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.OK).json({ user: tokenUser })
}
const logout = async (req, res) => {
    res.cookies('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({ msg: 'User logout' })
}

module.exports = {
    register,
    login,
    logout,
}