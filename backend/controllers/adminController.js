import Booking from "../models/booking.js";
import Show from "../models/show.js";
import User from "../models/user.js";

export const isAdmin = async (req, res) => {
  res.json({
    success: true,
    isAdmin: true,
  });
};

export const getDashboardData = async (req, res) => {
  try {
    const totalBookings = await Booking.find({ isPaid: true });
    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movies");
    const totalUsers = await User.countDocuments();

    const dashboardData = {
      totalBookings: totalBookings.length,
      totalRevenue: totalBookings.reduce(
        (acc, booking) => acc + booking.amount,
        0
      ),
      activeShows,
      totalUsers,
    };

    res.json({
      success: true,
      dashboardData,
    });
  } catch (error) {
    console.log("Error", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });
    res.json({
      success: true,
      shows,
    });
  } catch (error) {
    console.log("Error loading all shows", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log("Error loading all bookings", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
