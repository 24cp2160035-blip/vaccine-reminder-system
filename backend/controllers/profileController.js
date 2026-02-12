import Profile from "../models/profileModel.js";

// @desc Create a new profile (child or pet)
export const createProfile = async (req, res) => {
  try {
    const { name, type, dob, gender, photo, reminderTime, reminderDaysBefore, reminderEnabled } = req.body;

    const profile = await Profile.create({
      userId: req.user.id,
      name,
      type,
      dob,
      gender,
      photo,
      reminderTime: reminderTime || "08:00",
      reminderDaysBefore: reminderDaysBefore || 3,
      reminderEnabled: reminderEnabled !== undefined ? reminderEnabled : true,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all profiles for logged-in user
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.user.id });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a profile
export const deleteProfile = async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: "Profile deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get a single profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update profile (including notification settings)
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
