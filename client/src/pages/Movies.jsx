import React from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Movies = () => {
  const { shows } = useAppContext()
 
  return shows.length > 0 ? (
    <div className="relative mb-60 my-40 px-6 md:px-16 lg:px-40 xl:px-44 min-h-[80vh] overflow-hidden">
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      <h1 className="text-lg font-medium my-4">Now showing</h1>
      <div className="flex flex-wrap gap-8 max-sm:justify-center">
        {shows.map((show) => (
          <MovieCard movie={show} key={show._id} />
        ))}
      </div>
    </div>
  ) : (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
    </div>
  );
};

export default Movies;
