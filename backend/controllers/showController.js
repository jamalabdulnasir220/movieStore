import axios from "axios";
import Movie from "../models/movie.js";
import Show from "../models/show.js";
import { inngest } from "../innjest/index.js";

// API to get now playing movies from TMDB
export const nowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );
    const movies = data.results;
    res.json({
      success: true,
      movies: movies,
    });
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to add a new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch the movie details and the casts/credits from the TMDB database using their api with the movieId
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);
      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        casts: movieCreditsData.cast,
        genres: movieApiData.genres,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      movie = await Movie.create(movieDetails);
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
