import mongoose from "mongoose";

const vaccineLibrarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ageInWeeks: Number,    // 0, 6, 10, 14, 24…
  ageInMonths: Number,   // optional
  description: String,
});

export default mongoose.model("VaccineLibrary", vaccineLibrarySchema);