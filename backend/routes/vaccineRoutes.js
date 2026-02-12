import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addVaccine,
  getVaccinesByProfile,
  updateVaccine,
  deleteVaccine
} from "../controllers/vaccineController.js";

const router = express.Router();

// GET all vaccines for 1 profile
router.get("/:profileId", protect, getVaccinesByProfile);

// ADD a vaccine
router.post("/", protect, addVaccine);

// UPDATE a vaccine
router.put("/:id", protect, updateVaccine);

// DELETE a vaccine
router.delete("/:id", protect, deleteVaccine);

export default router;