import { Router } from "express";
import {
  patientLogin,
  registerPatient,
} from "../controllers/patients.controller.js";

const patientRouter = Router();

patientRouter.post("/register-patient", registerPatient);
patientRouter.post("/patient-login", patientLogin);
export default patientRouter;
