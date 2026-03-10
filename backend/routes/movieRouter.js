import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import {
  adminCreateMovie,
  adminDeleteMovie,
  adminGetMovie,
  adminListMovies,
  adminUpdateMovie,
} from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.get("/", protectAdmin, adminListMovies);
movieRouter.get("/:id", protectAdmin, adminGetMovie);
movieRouter.post("/", protectAdmin, adminCreateMovie);
movieRouter.put("/:id", protectAdmin, adminUpdateMovie);
movieRouter.delete("/:id", protectAdmin, adminDeleteMovie);

export default movieRouter;

