import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { dummyShowsData } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const FeaturedSection = () => {
  const { shows } = useAppContext();
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-2 group text-sm text-gray-300 cursor-pointer"
        >
          View All{" "}
          <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      <div className="flex flex-wrap gap-8 mt-8 max-sm:justify-center">
        {shows.slice(0, 4).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 bg-primary text-sm hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
