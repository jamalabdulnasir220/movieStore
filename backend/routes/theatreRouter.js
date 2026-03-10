import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { createTheatre, listTheatres } from "../controllers/theatreController.js";

const theatreRouter = express.Router();

// Public: list theatres with upcoming show info
theatreRouter.get("/", listTheatres);

// Admin: create theatre
theatreRouter.post("/", protectAdmin, createTheatre);

export default theatreRouter;

