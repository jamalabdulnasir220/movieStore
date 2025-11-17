// TheatreUnderDev.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TheatrePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center p-6">
      {/* decorative background rings */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div className="absolute -left-40 -top-40 w-[560px] h-[560px] rounded-full bg-amber-500/6 blur-3xl animate-blob" />
        <div className="absolute -right-40 -bottom-40 w-[520px] h-[520px] rounded-full bg-violet-500/6 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <section
        role="status"
        aria-live="polite"
        className="relative z-10 max-w-3xl w-full rounded-2xl bg-white/3 backdrop-blur-md border border-white/6 p-8 md:p-12 text-center shadow-2xl"
      >
        {/* Inject CSS keyframes for the SVG animations and shimmer.
            This is safe to include in a component and keeps everything self-contained. */}
        <style>{`
          /* Respect prefers-reduced-motion */
          @media (prefers-reduced-motion: reduce) {
            .motion-safe-animate-spin, .motion-safe-animate-bob, .motion-safe-animate-swing, .motion-safe-shimmer {
              animation: none !important;
            }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes bob {
            0% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0); }
          }
          @keyframes swing {
            0% { transform: rotate(-12deg); }
            50% { transform: rotate(12deg); }
            100% { transform: rotate(-12deg); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          /* subtle blob animation for background circles */
          @keyframes blob {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.05); }
            100% { transform: translateY(0) scale(1); }
          }

          .animate-blob { animation: blob 6s ease-in-out infinite; }
          .animation-delay-2000 { animation-delay: 1.8s; }

          .motion-safe-animate-spin { animation: spin 6s linear infinite; }
          .motion-safe-animate-bob { animation: bob 2.4s ease-in-out infinite; }
          .motion-safe-animate-swing { animation: swing 3s ease-in-out infinite; }
          .motion-safe-shimmer {
            background-size: 300% 100%;
            animation: shimmer 3s linear infinite;
          }
        `}</style>

        {/* Animated SVG (gear + wrench) */}
        <div className="flex items-center justify-center mb-6">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Under development animation"
            className="mx-auto"
          >
            {/* rotating gear */}
            <g transform="translate(80,80)">
              <g
                className="motion-safe-animate-spin"
                style={{ transformOrigin: "center" }}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="36"
                  fill="#0f172a"
                  stroke="#f59e0b"
                  strokeWidth="6"
                />
                {/* simple teeth */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 360) / 8;
                  return (
                    <rect
                      key={i}
                      x="-6"
                      y="-58"
                      width="12"
                      height="14"
                      rx="3"
                      fill="#f59e0b"
                      transform={`rotate(${angle}) translate(0, -2)`}
                    />
                  );
                })}
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="#071130"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
              </g>

              {/* swinging wrench in front */}
              <g
                className="motion-safe-animate-swing"
                transform="translate(36,-24)"
              >
                <path
                  d="M2 2c6 -6 18 -6 24 0 6 6 6 18 0 24l-8 -8c3 -3 3 -7 0 -10-3 -3-7 -3-10 0l-6 6-4-4z"
                  fill="#ffffff"
                  opacity="0.95"
                  transform="scale(1.6) rotate(18)"
                />
                <rect
                  x="10"
                  y="10"
                  width="6"
                  height="40"
                  rx="3"
                  fill="#f59e0b"
                  transform="rotate(-24) translate(0,0)"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Headline with shimmer */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
          <span className="relative inline-block px-1" aria-hidden>
            <span className="relative z-10">Under Development</span>
            {/* shimmer band */}
            <span
              className="absolute inset-0 -skew-x-6 opacity-20 rounded-lg motion-safe-shimmer"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.36) 55%, transparent 100%)",
              }}
            />
          </span>
        </h1>

        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-6">
          We’re building something great — this theatre page is getting a
          refresh. Check back soon or explore other sections while we finish up.
        </p>

        {/* progress bar */}
        <div className="mx-auto max-w-xl">
          <div
            className="relative w-full h-3 bg-white/6 rounded-full overflow-hidden mb-4"
            aria-hidden
          >
            <div
              className="absolute left-0 top-0 h-full w-1/3 bg-amber-400/80 motion-safe-animate-bob rounded-full"
              style={{ transform: "translateX(-10%)" }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none"
              aria-hidden
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400 text-amber-950 font-semibold shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Go Home
            </button>

            <button
              onClick={() => navigate("/movies")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/90 bg-white/4 hover:bg-white/6 focus:outline-none"
            >
              Explore Movies
            </button>
          </div>
        </div>

        {/* screen-reader friendly status text */}
        <div className="sr-only" aria-hidden={false}>
          This page is under development. Some features may be missing.
        </div>
      </section>
    </main>
  );
}
