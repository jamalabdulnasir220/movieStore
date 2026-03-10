import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const ListTheatres = () => {
  const { axios } = useAppContext();
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/theatres");
      if (data.success) {
        setTheatres(data.theatres);
      } else {
        toast.error(data.message || "Failed to fetch theatres");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch theatres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  return (
    <>
      <Title text1={"List"} text2={"Theatres"} />
      {loading ? (
        <Loading />
      ) : theatres.length === 0 ? (
        <p className="mt-8 text-gray-400">No theatres yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {theatres.map((t) => (
            <div
              key={t._id}
              className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-col gap-2"
            >
              <h3 className="font-semibold text-sm truncate">{t.name}</h3>
              {t.location && (
                <p className="text-xs text-gray-400 truncate">{t.location}</p>
              )}
              {t.screenName && (
                <p className="text-xs text-gray-400 truncate">
                  Screen: {t.screenName}
                </p>
              )}
              {t.description && (
                <p className="text-xs text-gray-400 line-clamp-2">
                  {t.description}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-300">
                <p>
                  Upcoming shows:{" "}
                  <span className="font-semibold">
                    {t.upcomingShowCount || 0}
                  </span>
                </p>
                {t.nextShow && (
                  <p>
                    Next:{" "}
                    <span className="font-semibold">
                      {t.nextShow.movieTitle}
                    </span>{" "}
                    <span className="text-gray-400">
                      {new Date(t.nextShow.dateTime).toLocaleString()}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ListTheatres;

