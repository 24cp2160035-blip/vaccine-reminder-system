import express from "express";
import { createProfile, getProfiles, deleteProfile, getProfileById, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import Profile from "../models/profileModel.js";

const router = express.Router();

router.post("/", protect, createProfile);   // Add profile
router.get("/", protect, getProfiles);      // Get all profiles
router.get("/:id", protect, getProfileById); // Get single profile
router.put("/:id", protect, updateProfile);  // Update profile (including notification settings)
router.delete("/:id", protect, deleteProfile); // Delete profile

// 📌 GET Notification Settings for ONE Profile
router.get("/:id/notifications", protect, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({
      reminderTime: profile.reminderTime,
      reminderDaysBefore: profile.reminderDaysBefore,
      reminderEnabled: profile.reminderEnabled,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 UPDATE Notification Settings
router.put("/:id/notifications", protect, async (req, res) => {
  try {
    const { reminderTime, reminderDaysBefore, reminderEnabled } = req.body;

    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { reminderTime, reminderDaysBefore, reminderEnabled },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ message: "Updated", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;