import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { CheckIcon, DeleteIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {
  const { axios, getToken, user, imageBaseUrl } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;
  const [myMovies, setMyMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const handleAddDateTime = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };

  const handleRemoveDateTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingTheatres, setLoadingTheatres] = useState(false);

  const fetchMyMovies = async () => {
    try {
      setLoadingMovies(true);
      const { data } = await axios.get("/api/admin/movies", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setMyMovies(data.movies);
      }
    } catch (error) {
      console.error("Error fetching admin movies", error);
    } finally {
      setLoadingMovies(false);
    }
  };

  const fetchTheatres = async () => {
    try {
      setLoadingTheatres(true);
      const { data } = await axios.get("/api/theatres");
      if (data.success) {
        setTheatres(data.theatres);
      }
    } catch (error) {
      console.error("Error fetching theatres", error);
    } finally {
      setLoadingTheatres(false);
    }
  };

  const getImage = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : imageBaseUrl + path;
  };

  const handleSubmit = async () => {
    try {
      setAddingShow(true);
      if (
        !selectedMovie ||
        !selectedTheatre ||
        Object.keys(dateTimeSelection).length === 0 ||
        !showPrice
      ) {
        return toast("Missing required field");
      }
      const showInput = Object.entries(dateTimeSelection).map(
        ([date, time]) => ({ date, time })
      );
      const payload = {
        movieId: selectedMovie,
        theatreId: selectedTheatre,
        showInput,
        showPrice: Number(showPrice),
      };
      const { data } = await axios.post("/api/show/add-show", payload, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setSelectedTheatre("");
        setShowPrice("");
        setDateTimeSelection({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding show", error);
      toast.error("An error occured, please try again");
    }
    setAddingShow(false);
  };

  useEffect(() => {
    if (user) {
      fetchMyMovies();
      fetchTheatres();
    }
  }, [user]);

  const content = (
    <>
      <Title text1={"Add"} text2={"Shows"} />
      {/* Theatre selector */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Select Theatre</label>
        {loadingTheatres ? (
          <div className="mt-2">
            <Loading />
          </div>
        ) : theatres.length > 0 ? (
          <select
            value={selectedTheatre}
            onChange={(e) => setSelectedTheatre(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm outline-none"
          >
            <option value="">Choose a theatre</option>
            {theatres.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
                {t.location ? ` • ${t.location}` : ""}
                {t.screenName ? ` • ${t.screenName}` : ""}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-400 text-sm">
            No theatres yet. Add one in{" "}
            <span className="font-semibold">Admin → Add Theatre</span>.
          </p>
        )}
      </div>
      <p className="mt-6 text-lg font-medium">Your Movies</p>
      <div className="overflow-x-auto pb-4">
        {loadingMovies ? (
          <div className="mt-4">
            <Loading />
          </div>
        ) : myMovies.length > 0 ? (
          <div className="group flex flex-wrap gap-4 mt-4 w-max">
            {myMovies.map((movie) => (
              <div
                key={movie._id}
                className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
                onClick={() => setSelectedMovie(movie._id)}
              >
                {/* Movie thumbnail */}
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={getImage(movie.poster_path)}
                    alt=""
                    className="w-full object-cover brightness-90 h-56"
                  />
                </div>
                {selectedMovie === movie._id && (
                  <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                    <CheckIcon
                      className="w-4 h-4 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                <p className="font-medium truncate mt-1">{movie.title}</p>
                <p className="text-gray-400 text-xs">
                  {movie.release_date || "No release date"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-4">
            No movies yet. Add one in <span className="font-semibold">Admin → Add Movie</span>.
          </p>
        )}
      </div>

      {/* Show Price Input */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none"
          />
        </div>
      </div>
      {/* Select date and time */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date and Time
        </label>
        <div className="inline-flex p-1 pl-3 gap-5 border border-gray-600 rounded-lg">
          <input
            type="datetime-local"
            className="outline-none rounded-md"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
          />
          <button
            onClick={handleAddDateTime}
            className="bg-primary/80 text-white text-sm px-3 py-2 rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>
      {/* Display Selected Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Date - Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="border border-primary px-2 py-1 flex items-center rounded"
                    >
                      <span>{time}</span>
                      <DeleteIcon
                        onClick={() => handleRemoveDateTime(date, time)}
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {addingShow ? "Adding..." : "Add Show"}
      </button>
    </>
  );

  return user ? content : <Loading />;
};

export default AddShows;
