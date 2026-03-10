import { clerkClient } from "@clerk/express";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";
import MovieRating from "../models/movieRating.js";

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

// API for users to rate a movie (1-5 stars)
export const rateMovie = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { movieId, rating } = req.body || {};

    if (!movieId) {
      return res.json({ success: false, message: "movieId is required" });
    }

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.json({ success: false, message: "Movie not found" });
    }

    // Upsert user's rating for this movie
    await MovieRating.findOneAndUpdate(
      { user: userId, movie: movieId },
      { rating: numericRating },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recalculate average rating for the movie
    const allRatings = await MovieRating.find({ movie: movieId });
    const average =
      allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
        : 0;

    movie.vote_average = average;
    await movie.save();

    return res.json({
      success: true,
      message: "Rating saved",
      rating: numericRating,
      averageRating: average,
    });
  } catch (error) {
    console.error("Error rating movie", error);
    return res.json({
      success: false,
      message: "Failed to save rating",
    });
  }
};

// API to get the current user's rating for a movie
export const getMyRating = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { movieId } = req.params;

    if (!movieId) {
      return res.json({ success: false, message: "movieId is required" });
    }

    const doc = await MovieRating.findOne({ user: userId, movie: movieId });

    return res.json({
      success: true,
      rating: doc ? doc.rating : null,
    });
  } catch (error) {
    console.error("Error fetching user rating", error);
    return res.json({
      success: false,
      message: "Failed to fetch rating",
    });
  }
}
