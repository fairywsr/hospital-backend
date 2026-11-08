import { Router } from "express";
import {
  allPatients,
  deleteProfile,
  patientLogin,
  patientLogout,
  patientProfile,
  registerPatient,
  resetPasswordRequest,
  updateProfile,
  resetPassword,
} from "../controllers/patient.controller.js";
import { authoriseRoles, isAuthenticatedUser } from "../utils/auth.js";

const patientRouter = Router();

patientRouter.post("/register-patient", registerPatient);
patientRouter.post("/patient-login", patientLogin);
patientRouter.get("logout", isAuthenticatedUser, patientLogout);
patientRouter.get("/profile/:id", isAuthenticatedUser, patientProfile);
patientRouter.put("/update-profile/:id", isAuthenticatedUser, updateProfile);
patientRouter.delete("/delete-profile/:id", isAuthenticatedUser, deleteProfile);
patientRouter.get(
  "/all-patients",
  isAuthenticatedUser,
  authoriseRoles("admin"),
  allPatients,
);
patientRouter.post("/reset-password-request", resetPasswordRequest);
patientRouter.put("/reset-Password/:token", resetPassword);
export default patientRouter;
