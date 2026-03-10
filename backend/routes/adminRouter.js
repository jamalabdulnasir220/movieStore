import express from "express";
import multer from "multer";
import { protectAdmin } from "../middleware/auth.js";
import movieRouter from "./movieRouter.js";
import {
  getAllBookings,
  getAllShows,
  getDashboardData,
  isAdmin,
} from "../controllers/adminController.js";
import { uploadImage } from "../controllers/uploadController.js";

const adminRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

adminRouter.use("/movies", movieRouter);
adminRouter.post(
  "/upload-image",
  protectAdmin,
  upload.single("file"),
  uploadImage
);
adminRouter.get("/is-admin", protectAdmin, isAdmin);
adminRouter.get("/dashboard", protectAdmin, getDashboardData);
adminRouter.get("/all-shows", protectAdmin, getAllShows);
adminRouter.get("/all-bookings", protectAdmin, getAllBookings);

export default adminRouter