import Vaccine from "../models/vaccineModel.js";
import Profile from "../models/profileModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const profiles = await Profile.find({ userId });
    const profileIds = profiles.map(p => p._id);
    
    const vaccines = await Vaccine.find({ profileId: { $in: profileIds } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdue = vaccines.filter(v => 
      v.status !== "completed" && new Date(v.dueDate) < today
    );
    
    const dueToday = vaccines.filter(v => {
      const due = new Date(v.dueDate);
      due.setHours(0, 0, 0, 0);
      return v.status !== "completed" && due.getTime() === today.getTime();
    });
    
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    
    const upcoming = vaccines.filter(v => {
      const due = new Date(v.dueDate);
      return v.status !== "completed" && due > today && due <= in7Days;
    });
    
    const completed = vaccines.filter(v => v.status === "completed");
    
    res.json({
      profiles: profiles.length,
      totalVaccines: vaccines.length,
      overdue: overdue.length,
      dueToday: dueToday.length,
      upcoming: upcoming.length,
      completed: completed.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
