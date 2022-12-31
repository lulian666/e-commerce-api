const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

const createReview = async (req, res) => {
    const { product: productId } = req.body
    const product = await Product.findOne({ _id: productId })
    if (!product) {
        throw new CustomError.NotFoundError('Product does not exist')
    }

    const isReviewExist = await Review.findOne({
        product: productId,
        user: req.user.userId,
    })
    if (isReviewExist) {
        throw new CustomError.BadRequestError('Already reviewed this product')
    }

    const review = await Review.create({ ...req.body, user: req.user.userId })
    res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name company price',
    })
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
    const review = await Review.findOne({ _id: req.params.id })
    if (!review) {
        throw new CustomError.BadRequestError(
            `Reivew with id ${req.params.id} does not exist`
        )
    }
    res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params
    const { rating, title, comment } = req.body
    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
        throw new CustomError.NotFoundError(
            `Review with id ${reviewId} does not exist`
        )
    }

    checkPermissions(req.user, review.user)

    review.rating = rating
    review.title = title
    review.comment = comment

    await review.save()

    res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
        throw new CustomError.NotFoundError(
            `Review with id ${reviewId} does not exist`
        )
    }

    checkPermissions(req.user, review.user)

    await review.remove()
    res.status(StatusCodes.OK).json({ msg: 'Review deleted' })
}

const getSingleProductReviews = async (req, res) => {
    const { id: productId } = req.params
    const reviews = await Review.find({ product: productId })
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews,
}
