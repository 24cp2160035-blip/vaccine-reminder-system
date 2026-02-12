import Vaccine from "../models/vaccineModel.js";
import Profile from "../models/profileModel.js";

export const exportVaccineHistory = async (req, res) => {
  try {
    const { profileId } = req.params;
    
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const vaccines = await Vaccine.find({ profileId }).sort({ dueDate: 1 });

    const data = {
      profile: {
        name: profile.name,
        type: profile.type,
        dob: profile.dob,
        gender: profile.gender
      },
      vaccines: vaccines.map(v => ({
        name: v.vaccineName,
        dueDate: v.dueDate,
        status: v.status,
        doctorName: v.doctorName,
        notes: v.notes,
        completedAt: v.status === "completed" ? v.updatedAt : null
      })),
      exportedAt: new Date()
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
