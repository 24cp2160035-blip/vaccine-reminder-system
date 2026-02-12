// backend/routes/vaccineLibraryRoutes.js
import express from "express";
import VaccineMaster from "../models/vaccineMasterModel.js";

const router = express.Router();

// GET all master vaccines (library)
router.get("/", async (req, res) => {
  try {
    const all = await VaccineMaster.find({});
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;