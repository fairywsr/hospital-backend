import { Router } from "express";
import {
  allPatients,
  deleteProfile,
  patientLogin,
  patientProfile,
  registerPatient,
  updateProfile,
} from "../controllers/patient.controller.js";

const patientRouter = Router();

patientRouter.post("/register-patient", registerPatient);
patientRouter.post("/patient-login", patientLogin);
patientRouter.get("/profile/:id", patientProfile);
patientRouter.put("/update-profile/:id", updateProfile);
patientRouter.delete("/delete-profile/:id", deleteProfile);
patientRouter.get("/all-patients", allPatients);
export default patientRouter;
