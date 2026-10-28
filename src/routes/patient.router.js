import { Router } from "express";
import { registerPatient } from "../controllers/patients.controller.js";

const patientRouter = Router();

patientRouter.post("/register-patient", registerPatient);

export default patientRouter;
