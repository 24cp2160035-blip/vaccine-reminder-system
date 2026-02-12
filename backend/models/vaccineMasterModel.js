import mongoose from "mongoose";

const vaccineMasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  recommendedAge: { type: String, required: true }, // e.g. "6 weeks", "9 months"
  description: { type: String, required: true }
});

export default mongoose.model("VaccineMaster", vaccineMasterSchema);