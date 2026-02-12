import express from "express";
import { getVaccineLibrary } from "../controllers/vaccineMasterController.js";

const router = express.Router();

router.get("/", getVaccineLibrary);

export default router;