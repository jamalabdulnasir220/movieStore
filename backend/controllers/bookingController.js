import Booking from "../models/booking.js";
import Show from "../models/show.js";

// Function to check seats availability
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.error("Error checking seat availability:", error.message);
    return false;
  }
};

// Create Booking Controller
export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // check seat availability
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "One or more selected seats are already booked.",
      });
    }

    //   Get show details
    const showData = await Show.findById(showId).populate("movie");

    //   Create a new booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    selectedSeats.map((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");

    await showData.save();

    //   Stripe Gateway Initialization

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Function to get occupied seats
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.status(200).json({
      success: true,
      occupiedSeats,
    });
  } catch (error) {
    console.error("Error fetching occupied seats:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
