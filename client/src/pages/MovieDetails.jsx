import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import { timeFormat } from "../utils/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";

const MovieDetails = () => {
  const {
    axios,
    imageBaseUrl,
    shows,
    user,
    getToken,
    fetchUserFavoriteMovies,
    favoriteMovies,
  } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();


  const [open, setOpen] = useState(false);

  const [show, setShow] = useState(null);

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow({
          movie: data.movie,
          dateTime: data.dateTime,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error getting movie");
      toast.error("Error getting movie", error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) {
        return toast.error("Please login to continue!");
      }
      const { data } = await axios.post(
        "/api/user/update-favorites",
        {
          movieId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        await fetchUserFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error handling favorite", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // close modal on Esc
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50 relative">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
          src={imageBaseUrl + show.movie?.poster_path}
          alt="Movie poster"
        />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl max-w-96 font-semibold text-balance">
            {show.movie?.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 fill-primary text-primary" />
            {show.movie?.vote_average.toFixed(1)} User Rating
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie?.overview}
          </p>
          <p>
            {timeFormat(show.movie?.runtime)} •{" "}
            {show.movie?.genres.map((genre) => genre.name).join("| ")} •{" "}
            {show.movie?.release_date.split("-")[0]}
          </p>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <button
              className="flex items-center gap-2 bg-gray-800 px-7 py-3 
            text-sm hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95"
              onClick={() => setOpen(true)}
            >
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="bg-primary hover:bg-primary-dull px-10 py-3 text-sm transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>
            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  favoriteMovies.find((movie) => movie._id === id)
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      <p className="text-lg mt-20 font-medium">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {show.movie?.casts?.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
                src={imageBaseUrl + cast.profile_path}
                alt="profile"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
              <p></p>
            </div>
          ))}
        </div>
      </div>
      <DateSelect id={id} dateTime={show.dateTime} />
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows.slice(0, 4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show more
        </button>
      </div>
      {/* Modal to open */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* modal container — keeps a 16:9 aspect ratio, limits size on small screens */}
          <div
            className="relative w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-xl"
            style={{ maxHeight: "90vh", aspectRatio: "16/9" }}
            onClick={(e) => e.stopPropagation()} // prevent backdrop click
          >
            {/* close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close trailer"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 hover:bg-black/60 p-2 text-white backdrop-blur transition"
            >
              ✕
            </button>

            {/* player wrapper — ReactPlayer fills this */}
            <div className="w-full h-full">
              <ReactPlayer
                src={`https://www.youtube.com/watch?v=${
                  show.movie.video.filter((v) => v.type === "Trailer")[0].key
                }`}
                playing={false}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDetails;
