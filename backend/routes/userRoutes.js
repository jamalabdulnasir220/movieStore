import express from 'express'
import { getFavorites, getMyRating, getUserBookings, rateMovie, updateFavorite } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get("/bookings", getUserBookings)
userRouter.post("/update-favorites", updateFavorite)
userRouter.get("/favorites", getFavorites)
userRouter.post("/rate-movie", rateMovie)
userRouter.get("/my-rating/:movieId", getMyRating)

export default userRouter