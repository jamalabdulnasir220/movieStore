import Movie from "../models/movie.js";

function normalizeGenres(genres) {
  if (!Array.isArray(genres)) return [];
  return genres
    .map((g) => {
      if (!g) return null;
      if (typeof g === "string") return { name: g };
      if (typeof g === "object" && typeof g.name === "string")
        return { ...g, name: g.name };
      return null;
    })
    .filter(Boolean);
}

function normalizeCasts(casts) {
  if (!Array.isArray(casts)) return [];
  return casts
    .map((c) => {
      if (!c) return null;
      if (typeof c === "string") return { name: c, profile_path: "" };
      if (typeof c === "object" && typeof c.name === "string")
        return { profile_path: "", ...c, name: c.name };
      return null;
    })
    .filter(Boolean);
}

export const adminListMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    console.error("adminListMovies error", error);
    res.json({ success: false, message: "Failed to fetch movies" });
  }
};

export const adminGetMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.json({ success: false, message: "Movie not found" });
    res.json({ success: true, movie });
  } catch (error) {
    console.error("adminGetMovie error", error);
    res.json({ success: false, message: "Failed to fetch movie" });
  }
};

export const adminCreateMovie = async (req, res) => {
  try {
    const {
      _id,
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      original_language,
      tagline,
      genres,
      casts,
      vote_average,
      runtime,
      video,
    } = req.body || {};

    if (!title || typeof title !== "string") {
      return res.json({ success: false, message: "Title is required" });
    }

    const payload = {
      ...(typeof _id === "string" && _id.trim() ? { _id: _id.trim() } : {}),
      title: title.trim(),
      overview: typeof overview === "string" ? overview : "",
      poster_path: typeof poster_path === "string" ? poster_path : "",
      backdrop_path: typeof backdrop_path === "string" ? backdrop_path : "",
      release_date: typeof release_date === "string" ? release_date : "",
      original_language:
        typeof original_language === "string" ? original_language : undefined,
      tagline: typeof tagline === "string" ? tagline : undefined,
      genres: normalizeGenres(genres),
      casts: normalizeCasts(casts),
      vote_average: Number.isFinite(Number(vote_average))
        ? Number(vote_average)
        : 0,
      runtime: Number.isFinite(Number(runtime)) ? Number(runtime) : 0,
      video: Array.isArray(video) ? video : [],
    };

    const movie = await Movie.create(payload);
    res.json({ success: true, movie, message: "Movie created" });
  } catch (error) {
    console.error("adminCreateMovie error", error);
    // Duplicate key (manual _id collides)
    if (error?.code === 11000) {
      return res.json({
        success: false,
        message: "Movie id already exists",
      });
    }
    res.json({ success: false, message: "Failed to create movie" });
  }
};

export const adminUpdateMovie = async (req, res) => {
  try {
    const {
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      original_language,
      tagline,
      genres,
      casts,
      vote_average,
      runtime,
      video,
    } = req.body || {};

    const update = {};
    if (typeof title === "string") update.title = title.trim();
    if (typeof overview === "string") update.overview = overview;
    if (typeof poster_path === "string") update.poster_path = poster_path;
    if (typeof backdrop_path === "string") update.backdrop_path = backdrop_path;
    if (typeof release_date === "string") update.release_date = release_date;
    if (typeof original_language === "string")
      update.original_language = original_language;
    if (typeof tagline === "string") update.tagline = tagline;
    if (Array.isArray(genres)) update.genres = normalizeGenres(genres);
    if (Array.isArray(casts)) update.casts = normalizeCasts(casts);
    if (vote_average !== undefined)
      update.vote_average = Number.isFinite(Number(vote_average))
        ? Number(vote_average)
        : 0;
    if (runtime !== undefined)
      update.runtime = Number.isFinite(Number(runtime)) ? Number(runtime) : 0;
    if (Array.isArray(video)) update.video = video;

    const movie = await Movie.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!movie) return res.json({ success: false, message: "Movie not found" });
    res.json({ success: true, movie, message: "Movie updated" });
  } catch (error) {
    console.error("adminUpdateMovie error", error);
    res.json({ success: false, message: "Failed to update movie" });
  }
};

export const adminDeleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.json({ success: false, message: "Movie not found" });
    res.json({ success: true, message: "Movie deleted" });
  } catch (error) {
    console.error("adminDeleteMovie error", error);
    res.json({ success: false, message: "Failed to delete movie" });
  }
};

