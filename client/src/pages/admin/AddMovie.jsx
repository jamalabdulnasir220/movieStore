import React, { useState } from "react";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddMovie = () => {
  const { axios, getToken } = useAppContext();

  const [uploading, setUploading] = useState({
    poster: false,
    backdrop: false,
    castIndex: null,
  });

  const [form, setForm] = useState({
    title: "",
    overview: "",
    release_date: "",
    runtime: "",
    genresText: "",
    poster_path: "",
    backdrop_path: "",
    trailerKey: "",
  });

  const [casts, setCasts] = useState([]);
  const [newCastName, setNewCastName] = useState("");
  const [posterFileName, setPosterFileName] = useState("");
  const [backdropFileName, setBackdropFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileUpload = async (file, field, index = null) => {
    if (!file) return;
    try {
      setUploading((p) => ({ ...p, [field]: true, castIndex: index }));
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post("/api/admin/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success && data.url) {
        if (field === "poster") {
          setForm((p) => ({ ...p, poster_path: data.url }));
          setPosterFileName(file.name);
        } else if (field === "backdrop") {
          setForm((p) => ({ ...p, backdrop_path: data.url }));
          setBackdropFileName(file.name);
        } else if (field === "cast" && index !== null) {
          setCasts((prev) =>
            prev.map((c, i) => (i === index ? { ...c, profile_path: data.url } : c))
          );
        }
        toast.success("Image uploaded");
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading((p) => ({ ...p, [field]: false, castIndex: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (!form.title.trim()) return toast.error("Title is required");

      const genres = form.genresText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      const video = form.trailerKey.trim()
        ? [{ type: "Trailer", key: form.trailerKey.trim() }]
        : [];

      const payload = {
        title: form.title.trim(),
        overview: form.overview,
        release_date: form.release_date,
        runtime: Number(form.runtime) || 0,
        genres,
        casts,
        poster_path: form.poster_path,
        backdrop_path: form.backdrop_path,
        video,
      };

      const { data } = await axios.post("/api/admin/movies", payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message || "Movie created");
        setForm({
          title: "",
          overview: "",
          release_date: "",
          runtime: "",
          genresText: "",
          poster_path: "",
          backdrop_path: "",
          trailerKey: "",
        });
        setCasts([]);
        setNewCastName("");
        setPosterFileName("");
        setBackdropFileName("");
      } else {
        toast.error(data.message || "Failed to create movie");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create movie");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Title text1={"Add"} text2={"Movie"} />
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
            placeholder="Movie title"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Overview</label>
          <textarea
            name="overview"
            value={form.overview}
            onChange={onChange}
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none resize-none"
            placeholder="Short description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Release date
            </label>
            <input
              name="release_date"
              value={form.release_date}
              onChange={onChange}
              type="date"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Runtime</label>
            <input
              name="runtime"
              value={form.runtime}
              onChange={onChange}
              type="number"
              min={0}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
              placeholder="Minutes"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Trailer (YouTube key)
            </label>
            <input
              name="trailerKey"
              value={form.trailerKey}
              onChange={onChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
              placeholder="e.g. WpW36ldAqnM"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Genres (comma separated)
          </label>
          <input
            name="genresText"
            value={form.genresText}
            onChange={onChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
            placeholder="Action, Comedy, Drama"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Casts (name + photo)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              value={newCastName}
              onChange={(e) => setNewCastName(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
              placeholder="Cast name"
            />
            <button
              type="button"
              onClick={() => {
                if (!newCastName.trim()) return;
                setCasts((prev) => [
                  ...prev,
                  { name: newCastName.trim(), profile_path: "" },
                ]);
                setNewCastName("");
              }}
              className="bg-primary text-white px-4 rounded text-sm cursor-pointer"
            >
              Add
            </button>
          </div>
          {casts.length > 0 && (
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {casts.map((cast, index) => (
                <li
                  key={`${cast.name}-${index}`}
                  className="flex items-center justify-between gap-3 bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {cast.profile_path ? (
                      <img
                        src={cast.profile_path}
                        alt={cast.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                        No photo
                      </div>
                    )}
                    <span className="truncate text-sm">{cast.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 cursor-pointer">
                      <span className="underline">Upload photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e.target.files[0], "cast", index)
                        }
                      />
                    </label>
                    {uploading.cast && uploading.castIndex === index && (
                      <span className="text-xs text-gray-400">Uploading...</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setCasts((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Poster image
            </label>
            <div className="bg-gray-800 border border-gray-700 rounded-md p-3 flex flex-col items-start gap-3">
              <div className="w-full flex items-center gap-3">
                <div className="w-16 h-24 bg-gray-700 rounded overflow-hidden flex items-center justify-center text-xs text-gray-400">
                  {form.poster_path ? (
                    <img
                      src={form.poster_path}
                      alt="Poster preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">
                    {posterFileName || "No file selected"}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Choose an image from your computer to use as the poster.
                  </p>
                </div>
              </div>
              <label className="text-xs text-gray-200 cursor-pointer">
                <span className="inline-block px-3 py-1 rounded bg-primary/80 hover:bg-primary text-white text-xs">
                  {uploading.poster ? "Uploading..." : "Choose file"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files[0], "poster")}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Backdrop image
            </label>
            <div className="bg-gray-800 border border-gray-700 rounded-md p-3 flex flex-col items-start gap-3">
              <div className="w-full flex items-center gap-3">
                <div className="w-24 h-16 bg-gray-700 rounded overflow-hidden flex items-center justify-center text-xs text-gray-400">
                  {form.backdrop_path ? (
                    <img
                      src={form.backdrop_path}
                      alt="Backdrop preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">
                    {backdropFileName || "No file selected"}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Wide image for backgrounds and details page.
                  </p>
                </div>
              </div>
              <label className="text-xs text-gray-200 cursor-pointer">
                <span className="inline-block px-3 py-1 rounded bg-primary/80 hover:bg-primary text-white text-xs">
                  {uploading.backdrop ? "Uploading..." : "Choose file"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload(e.target.files[0], "backdrop")
                  }
                />
              </label>
            </div>
          </div>
        </div>

        <button
          disabled={submitting}
          className="bg-primary text-white px-8 py-2 rounded hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {submitting ? "Creating..." : "Create Movie"}
        </button>
      </form>
    </>
  );
};

export default AddMovie;

