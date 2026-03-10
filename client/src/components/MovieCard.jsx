import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { timeFormat } from "../utils/timeFormat";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ movie }) => {
  const { imageBaseUrl } = useAppContext();
  const navigate = useNavigate();
  const getImage = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : imageBaseUrl + path;
  };
  const year = movie?.release_date ? new Date(movie.release_date).getFullYear() : "";
  const genresText = Array.isArray(movie?.genres)
    ? movie.genres
        .slice(0, 2)
        .map((g) => (typeof g === "string" ? g : g?.name))
        .filter(Boolean)
        .join(",")
    : "";
  const rating = Number.isFinite(Number(movie?.vote_average))
    ? Number(movie.vote_average).toFixed(1)
    : "0.0";
  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={getImage(movie?.backdrop_path || movie?.poster_path)}
        alt="Movie Image"
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />
      <p className="font-semibold mt-2 truncate">{movie.title}</p>
      <p className="text-sm text-gray-400 mt-2">
        {year} {year && (genresText || movie?.runtime ? "-" : "")}{" "}
        {genresText} {(genresText && movie?.runtime) ? "-" : ""}{" "}
        {timeFormat(movie?.runtime || 0)}
      </p>
      <div className="flex justify-between items-center mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="bg-primary hover:bg-primary-dull px-4 py-2 text-xs transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>
        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />{" "}
          {rating}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
