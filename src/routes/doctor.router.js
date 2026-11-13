import { Router } from "express";
import {
  deleteProfile,
  doctorLogout,
  doctorProfile,
  editProfile,
  getAllDoctors,
  loginDoctor,
  registerDoctor,
  updatePasswordDoctor,
  resetPasswordRequestDoctor,
  resetPasswordDoctor,
  approveDoctor,
  rejectDoctor,
  pendingDoctors,
} from "../controllers/doctor.controller.js";
import { authoriseRoles, isAuthenticatedUser } from "../utils/auth.js";

const doctorRouter = Router();

doctorRouter.post("/register-doctor", registerDoctor);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/logout", isAuthenticatedUser, doctorLogout);
doctorRouter.get(
  "/profile/:id",
  isAuthenticatedUser,
  authoriseRoles("admin"),
  doctorProfile,
);
doctorRouter.put("/update-profile/:id", isAuthenticatedUser, editProfile);
doctorRouter.delete("/delete-profile/:id", isAuthenticatedUser, deleteProfile);
doctorRouter.get("/all-doctors", isAuthenticatedUser, getAllDoctors);
doctorRouter.post("/reset-password-request", resetPasswordRequestDoctor);
doctorRouter.put("/reset-Password/:token", resetPasswordDoctor);
doctorRouter.put("/update-password", isAuthenticatedUser, updatePasswordDoctor);
doctorRouter.post(
  "/approve-doctor/:id",
  isAuthenticatedUser,
  authoriseRoles("Admin"),
  approveDoctor,
);
doctorRouter.post(
  "/reject-doctor/:id",
  isAuthenticatedUser,
  authoriseRoles("Admin"),
  rejectDoctor,
);
doctorRouter.get(
  "/pending-status",
  isAuthenticatedUser,
  authoriseRoles("Admin"),
  pendingDoctors,
);
export default doctorRouter;
