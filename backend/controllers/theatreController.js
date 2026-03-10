import Theatre from "../models/theatre.js";
import Show from "../models/show.js";

export const createTheatre = async (req, res) => {
  try {
    const { name, location, screenName, description } = req.body || {};

    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Name is required" });
    }

    const theatre = await Theatre.create({
      name: name.trim(),
      location: location || "",
      screenName: screenName || "",
      description: description || "",
    });

    return res.json({ success: true, theatre, message: "Theatre created" });
  } catch (error) {
    console.error("createTheatre error", error);
    return res.json({
      success: false,
      message: "Failed to create theatre",
    });
  }
};

export const listTheatres = async (_req, res) => {
  try {
    const theatres = await Theatre.find({ isActive: true }).sort({
      createdAt: -1,
    });

    const theatreIds = theatres.map((t) => t._id);
    const now = new Date();

    const shows = await Show.find({
      theatre: { $in: theatreIds },
      showDateTime: { $gte: now },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const byTheatre = new Map();

    shows.forEach((show) => {
      const key = String(show.theatre);
      if (!byTheatre.has(key)) {
        byTheatre.set(key, []);
      }
      byTheatre.get(key).push(show);
    });

    const enriched = theatres.map((t) => {
      const key = String(t._id);
      const theatreShows = byTheatre.get(key) || [];
      const upcomingShowCount = theatreShows.length;
      const nextShow = theatreShows[0]
        ? {
            movieTitle: theatreShows[0].movie?.title,
            dateTime: theatreShows[0].showDateTime,
          }
        : null;

      return {
        _id: t._id,
        name: t.name,
        location: t.location,
        screenName: t.screenName,
        description: t.description,
        upcomingShowCount,
        nextShow,
      };
    });

    return res.json({ success: true, theatres: enriched });
  } catch (error) {
    console.error("listTheatres error", error);
    return res.json({
      success: false,
      message: "Failed to fetch theatres",
    });
  }
};

