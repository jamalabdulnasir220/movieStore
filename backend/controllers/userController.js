import { clerkClient } from "@clerk/express";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";

// API to get bookings for a particular user
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.auth();
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log("Error getting user bookings", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to update favorite movie in the clerk user metadata
export const updateFavorite = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await clerkClient.users.getUser(userId);
    const { movieId } = req.body;

    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter(
        (item) => item !== movieId
      );
    }
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });
    res.json({
      success: true,
      message: "Favorite updated successfully",
    });
  } catch (error) {
    console.log("Error updating favorites", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get favorites movies and display them
export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await clerkClient.users.getUser(userId)
        const getUserFavorites = user.privateMetadata.favorites

        // Get the moviedata from the favorites which has the movieId
        const movies = await Movie.find({ _id: { $in: getUserFavorites } })
        
        res.json({
            success: true,
            movies
        })

    } catch (error) {
        console.log("Error getting favorite movies", error.message)
        res.json({
            success: false,
            message: error.message
        })
    }
}