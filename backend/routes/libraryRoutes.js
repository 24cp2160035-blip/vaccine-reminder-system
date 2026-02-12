// backend/routes/libraryRoutes.js
import express from "express";
import { getAllVaccines, addVaccineToProfile } from "../controllers/libraryController.js";

const router = express.Router();

// Public route → returns complete vaccine library
router.get("/", getAllVaccines);

// Add selected vaccine to user's child profile
router.post("/add", addVaccineToProfile);

export default router; // <<< THIS FIXES THE ERROR