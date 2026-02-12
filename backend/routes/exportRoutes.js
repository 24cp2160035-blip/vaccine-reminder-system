import express from "express";
import { exportVaccineHistory } from "../controllers/exportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:profileId", protect, exportVaccineHistory);

export default router;
