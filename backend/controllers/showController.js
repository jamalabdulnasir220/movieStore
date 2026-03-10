import Movie from "../models/movie.js";
import Show from "../models/show.js";
import { inngest } from "../innjest/index.js";

// API to add a new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showInput, showPrice, theatreId } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.json({
        success: false,
        message: "Movie not found. Please create the movie first.",
      });
    }

    if (!theatreId) {
      return res.json({
        success: false,
        message: "Please select a theatre for this show.",
      });
    }

    const showToCreate = [];

    showInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice: showPrice,
          theatre: theatreId,
          occupiedSeats: {},
        });
      });
    });

    if (showToCreate.length > 0) {
      // Insert multiple show documents into the Show collection
      await Show.insertMany(showToCreate);
    }

    // Trigger inngest event.
    await inngest.send({
      name: "app/show.added",
      data: {
        movieTitle: movie.title,
      },
    });

    res.json({
      success: true,
      message: "Shows added successfully",
    });
  } catch (error) {
    console.error("Error adding new show:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get all shows from the database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // Get unique shows based on movie ID
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.json({
      success: true,
      shows: Array.from(uniqueShows),
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get a single show from the database
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    //  Get all upcoming shows for the given movie ID
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });
    const movie = await Movie.findById(movieId);

    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    res.json({
      success: true,
      movie,
      dateTime,
    });
  } catch (error) {
    console.error("Error fetching show:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
