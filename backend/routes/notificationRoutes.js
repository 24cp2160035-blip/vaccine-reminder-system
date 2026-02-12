import express from "express";
import Profile from "../models/profileModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Update notification settings
router.patch("/:id/notifications", protect, async (req, res) => {
  try {
    const { reminderTime, reminderDaysBefore, reminderEnabled } = req.body;

    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      {
        reminderTime,
        reminderDaysBefore,
        reminderEnabled,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;