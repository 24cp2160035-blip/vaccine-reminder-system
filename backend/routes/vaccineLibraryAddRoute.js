import express from "express";
import Vaccine from "../models/vaccineModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST → Add library vaccine into selected profile
router.post("/", protect, async (req, res) => {
  console.log("📩 Incoming ADD request:", req.body);

  try {
    const { profileId, name, recommendedAge } = req.body;

    if (!profileId) return res.status(400).json({ message: "Profile ID missing" });

    const newVac = await Vaccine.create({
      profileId,
      vaccineName: name,
      dueDate: new Date(), // later we will calculate using age
      status: "pending",
      notes: `Recommended Age: ${recommendedAge}`
    });

    console.log("✔ Successfully added:", newVac);
    res.status(201).json(newVac);

  } catch (err) {
    console.log("🔥 ERROR while adding:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;