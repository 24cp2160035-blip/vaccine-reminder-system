import mongoose from "mongoose";

const vaccineSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    vaccineName: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
    },
    doctorName: { type: String },
    notes: { type: String },
    
    // NEW: Custom reminder date and time
    remindMeDate: { type: Date },
    remindMeTime: { type: String }, // Format: "HH:MM" (e.g., "14:30")
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vaccine = mongoose.model("Vaccine", vaccineSchema);
export default Vaccine;