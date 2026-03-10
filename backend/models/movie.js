import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    // TMDB movies use TMDB id string; manual movies will auto-generate a string id.
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    title: { type: String, required: true },
    overview: { type: String, default: "" },
    // Accept either TMDB paths (e.g. "/abc.jpg") or full URLs (e.g. "https://...")
    poster_path: { type: String, default: "" },
    backdrop_path: { type: String, default: "" },
    // Keep as string for compatibility with current frontend usage
    release_date: { type: String, default: "" },
    video: { type: Array, default: [] },
    original_language: { type: String },
    tagline: { type: String },
    genres: { type: Array, default: [] },
    casts: { type: Array, default: [] },
    vote_average: { type: Number, default: 0 },
    runtime: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
