const express = require('express')
const app = express()

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const connectDB = require('./db/connect')
require('dotenv').config()
require('express-async-errors')

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

const notFound = require('./middleware/error-handler')
const errorHandlerMiddleware = require('./middleware/not-found')

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload())

app.get('/hi', (req, res) => {
    console.log('req.cookies', req.signedCookies)
    res.send('Home Page')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, console.log(`Server listening on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()
