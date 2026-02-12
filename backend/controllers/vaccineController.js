import Vaccine from "../models/vaccineModel.js";

// Add vaccine
export const addVaccine = async (req, res) => {
  try {
    const { profileId, vaccineName, dueDate, doctorName, notes, remindMeDate, remindMeTime } = req.body;

    const vaccine = await Vaccine.create({
      profileId,
      vaccineName,
      dueDate,
      doctorName,
      notes,
      remindMeDate: remindMeDate || null,
      remindMeTime: remindMeTime || null,
      status: "pending",
    });

    res.status(201).json(vaccine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vaccines for one profile
export const getVaccinesByProfile = async (req, res) => {
  try {
    const vaccines = await Vaccine.find({ profileId: req.params.profileId });
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update vaccine (status, notes, doctorName, dueDate)
export const updateVaccine = async (req, res) => {
  try {
    const updates = req.body; // can update status, notes, doctorName, dueDate

    const vaccine = await Vaccine.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!vaccine) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    res.json(vaccine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete vaccine
export const deleteVaccine = async (req, res) => {
  try {
    await Vaccine.findByIdAndDelete(req.params.id);
    res.json({ message: "Vaccine deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};