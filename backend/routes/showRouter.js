import express from "express";
import {
  addShow,
  getShow,
  getShows,
  nowPlayingMovies,
} from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get("/now-playing", protectAdmin, nowPlayingMovies);
showRouter.post("/add-show", protectAdmin, addShow);
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getShow);

export default showRouter;
