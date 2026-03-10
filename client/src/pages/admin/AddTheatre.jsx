import React, { useState } from "react";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddTheatre = () => {
  const { axios, getToken } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    location: "",
    screenName: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      return toast.error("Name is required");
    }
    try {
      setSubmitting(true);
      const { data } = await axios.post("/api/theatres", form, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        toast.success(data.message || "Theatre created");
        setForm({
          name: "",
          location: "",
          screenName: "",
          description: "",
        });
      } else {
        toast.error(data.message || "Failed to create theatre");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create theatre");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Title text1={"Add"} text2={"Theatre"} />
      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-xl space-y-4 bg-gray-900/60 border border-gray-700/60 rounded-xl p-5"
      >
        <div>
          <label className="block text-sm text-gray-200 mb-1">
            Theatre name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
            placeholder="e.g. Silverbird Cinema"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-200 mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
            placeholder="City / area"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-200 mb-1">
            Screen name
          </label>
          <input
            name="screenName"
            value={form.screenName}
            onChange={onChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none"
            placeholder="e.g. Screen 1, VIP Hall"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none resize-none"
            placeholder="Optional details about this theatre"
          />
        </div>
        <button
          disabled={submitting}
          className="bg-primary text-white px-8 py-2 rounded hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {submitting ? "Creating..." : "Create Theatre"}
        </button>
      </form>
    </>
  );
};

export default AddTheatre;

