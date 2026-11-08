import { Router } from "express";
import {
  deleteProfile,
  doctorLogout,
  doctorProfile,
  editProfile,
  getAllDoctors,
  loginDoctor,
  registerDoctor,
  resetPasswordRequest,
} from "../controllers/doctor.controller.js";
import { authoriseRoles, isAuthenticatedUser } from "../utils/auth.js";

const doctorRouter = Router();

doctorRouter.post("/register-doctor", registerDoctor);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("logout", isAuthenticatedUser, doctorLogout);
doctorRouter.get(
  "/profile/:id",
  isAuthenticatedUser,
  authoriseRoles("admin"),
  doctorProfile,
);
doctorRouter.put("/update-profile/:id", isAuthenticatedUser, editProfile);
doctorRouter.delete("/delete-profile/:id", isAuthenticatedUser, deleteProfile);
doctorRouter.get("/all-doctors", isAuthenticatedUser, getAllDoctors);
doctorRouter.post("/reset-password-request", resetPasswordRequest);
export default doctorRouter;
