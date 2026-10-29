import { Router } from "express";
import {
  patientLogin,
  patientProfile,
  registerPatient,
} from "../controllers/patient.controller.js";

const patientRouter = Router();

patientRouter.post("/register-patient", registerPatient);
patientRouter.post("/patient-login", patientLogin);
patientRouter.get("/profile/:id", patientProfile);
export default patientRouter;
