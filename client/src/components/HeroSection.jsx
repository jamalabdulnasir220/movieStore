import React from "react";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url('/backgroundImagee.jpg')] bg-cover bg-center h-screen">
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110 mt-20">
        Book shows, pick seats, go <br /> faster
      </h1>
      <div className="mt-6 inline-flex items-center gap-4 bg-white/6 backdrop-blur-md p-3 rounded-xl shadow-sm">
        {/* genre pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {["Action", "Adventure", "Sci-Fi"].map((g) => (
            <span
              key={g}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white/8 text-white/95"
            >
              {g}
            </span>
          ))}
        </div>

        <div className="h-6 w-px bg-white/10 mx-2" />
      </div>
      <p className="max-w-md text-gray-300">
        showQueue makes finding, booking and scheduling movies effortless:
        choose date, time and the perfect seat in seconds.
      </p>
      <p className="max-w-md text-gray-300">
        Rated experiences, simple checkout, secure payments, email reminders
      </p>
      <button
        className="flex items-center gap-1 bg-primary px-6 py-3 
      text-sm hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        onClick={() => navigate("/movies")}
      >
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSection;
