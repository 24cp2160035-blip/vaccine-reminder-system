import VaccineMaster from "../models/vaccineMasterModel.js";

export const getVaccineLibrary = async (req, res) => {
  try {
    const list = await VaccineMaster.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};