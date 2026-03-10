import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { Trash2Icon } from "lucide-react";

const ListMovies = () => {
  const { axios, getToken, imageBaseUrl, user } = useAppContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImage = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : imageBaseUrl + path;
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/movies", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) setMovies(data.movies);
      else toast.error(data.message || "Failed to fetch movies");
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/admin/movies/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success(data.message || "Deleted");
        setMovies((prev) => prev.filter((m) => m._id !== id));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    if (user) fetchMovies();
  }, [user]);

  return (
    <>
      <Title text1={"List"} text2={"Movies"} />
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((m) => (
            <div
              key={m._id}
              className="bg-primary/10 border border-primary/20 rounded-lg overflow-hidden"
            >
              <div className="h-44 bg-black/20">
                {m.poster_path ? (
                  <img
                    src={getImage(m.poster_path)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No poster
                  </div>
                )}
              </div>
              <div className="p-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{m.title}</p>
                  <p className="text-xs text-gray-400 truncate">
                    id: {m._id}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  title="Delete"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {movies.length === 0 && (
            <p className="text-gray-400">No movies yet.</p>
          )}
        </div>
      )}
    </>
  );
};

export default ListMovies;

