import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // 🔔 NEW FIELDS
    reminderTime: { type: String, default: "08:00" },     // 8AM default
    reminderDaysBefore: { type: Number, default: 3 },     // Remind 3 days before due date
    reminderEnabled: { type: Boolean, default: true },    // Allow user to disable reminders

    // 📌 EXISTING PROFILE FIELDS
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    type: { type: String, enum: ["child", "pet"], required: true },
    dob: { type: Date, required: true },
    gender: { type: String },
    photo: { type: String }, // optional future feature (photo upload)
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;