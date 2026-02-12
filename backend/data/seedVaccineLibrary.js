import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import VaccineMaster from "../models/vaccineMasterModel.js";

const vaccineData = [
  { name: "BCG", recommendedAge: "At birth", description: "Protects against tuberculosis." },
  { name: "Hepatitis-B (Birth dose)", recommendedAge: "At birth", description: "Prevents hepatitis B viral infection." },
  { name: "OPV-0", recommendedAge: "Birth", description: "Oral Polio Vaccine for polio prevention." },
  { name: "Pentavalent-1", recommendedAge: "6 weeks", description: "Protects against DPT + Hep B + Hib." },
  { name: "OPV-1", recommendedAge: "6 weeks", description: "Oral Polio Vaccine booster." },
  { name: "Rotavirus-1", recommendedAge: "6 weeks", description: "Protects against Rotavirus diarrhea." },
  { name: "PCV-1", recommendedAge: "6 weeks", description: "Pneumococcal Conjugate Vaccine." },
  { name: "Pentavalent-2", recommendedAge: "10 weeks", description: "Second dose of DPT-HepB-Hib." },
  { name: "OPV-2", recommendedAge: "10 weeks", description: "Oral Polio Vaccine." },
  { name: "Rotavirus-2", recommendedAge: "10 weeks", description: "Second Rotavirus vaccine dose." },
  { name: "PCV-2", recommendedAge: "10 weeks", description: "Second Pneumococcal dose." },
  { name: "Pentavalent-3", recommendedAge: "14 weeks", description: "Third dose of DPT-HepB-Hib." },
  { name: "OPV-3", recommendedAge: "14 weeks", description: "Oral Polio Booster." },
  { name: "Rotavirus-3", recommendedAge: "14 weeks", description: "Third Rotavirus vaccine dose." },
  { name: "PCV-Booster", recommendedAge: "9 months", description: "Pneumococcal booster dose." },
  { name: "MR-1", recommendedAge: "9 months", description: "Measles & Rubella Vaccine - First dose." },
  { name: "JE-1 (Endemic areas)", recommendedAge: "9 months", description: "Japanese Encephalitis dose 1." },
  { name: "DPT Booster-1", recommendedAge: "16-24 months", description: "Diphtheria, Pertussis, Tetanus booster." },
  { name: "MR-2", recommendedAge: "16-24 months", description: "Second Measles Rubella dose." },
  { name: "JE-2", recommendedAge: "16-24 months", description: "Second Japanese Encephalitis dose." },
  { name: "OPV Booster", recommendedAge: "16-24 months", description: "Booster polio protection." },
  { name: "Varicella (Chickenpox)", recommendedAge: "15 months", description: "Protects against chickenpox." },
  { name: "DTwP/DTaP Booster", recommendedAge: "4-6 years", description: "Second booster for DPT." },
  { name: "Tdap/Td", recommendedAge: "10-16 years", description: "Tetanus, diphtheria, pertussis vaccine." }
];

(async () => {
  try {
    // FIX: Use the variable name only
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to DB");

    await VaccineMaster.deleteMany();
    console.log("🗑 Old data cleared");

    await VaccineMaster.insertMany(vaccineData);
    console.log("🔥 Vaccine Library Loaded Successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();