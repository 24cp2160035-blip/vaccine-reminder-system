// backend/controllers/libraryController.js
import VaccineLibrary from "../models/vaccineLibraryModel.js";
import Vaccine from "../models/vaccineModel.js";

// 🔹 Get all vaccines (library list)
export const getAllVaccines = async (req, res) => {
  try {
    const vaccines = await VaccineLibrary.find().sort({ ageInWeeks: 1 });
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Add selected vaccine → into child's vaccination list
export const addVaccineToProfile = async (req, res) => {
  try {
    const { profileId, vaccineId } = req.body;

    // find library vaccine
    const record = await VaccineLibrary.findById(vaccineId);
    if (!record) return res.status(404).json({ message: "Vaccine not found" });

    // add to user's vaccines collection
    const newVaccine = await Vaccine.create({
      profileId,
      vaccineName: record.name,
      dueDate: new Date(), // default for now — later we calculate age based schedule
      doctorName: "",
      notes: record.description,
      status: "pending"
    });

    res.status(201).json({ message: "Added to profile", newVaccine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};