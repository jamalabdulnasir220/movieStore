import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";

const TheatrePage = () => {
  const { axios } = useAppContext();
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/theatres");
      if (data.success) {
        setTheatres(data.theatres);
      }
    } catch (error) {
      console.error("Error fetching theatres", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  return (
    <main className="relative min-h-screen px-6 md:px-16 lg:px-40 pt-30 md:pt-40 pb-20">
      <BlurCircle top="-40px" left="-60px" />
      <BlurCircle bottom="-40px" right="-80px" />
      <section className="relative z-10 max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Theatres & Screens
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">
            Discover where your shows are playing. Each theatre groups upcoming
            shows for different movies and times.
          </p>
        </header>

        {loading ? (
          <Loading />
        ) : theatres.length === 0 ? (
          <p className="text-gray-400 mt-6">
            No theatres have been added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {theatres.map((t) => (
              <article
                key={t._id}
                className="bg-gray-900/70 border border-gray-700/60 rounded-xl p-4 flex flex-col gap-2"
              >
                <h2 className="text-sm font-semibold truncate">{t.name}</h2>
                {(t.location || t.screenName) && (
                  <p className="text-xs text-gray-400 truncate">
                    {t.location}
                    {t.location && t.screenName ? " • " : ""}
                    {t.screenName}
                  </p>
                )}
                {t.description && (
                  <p className="text-xs text-gray-400 line-clamp-3">
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
                    <p className="mt-1">
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
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TheatrePage;
