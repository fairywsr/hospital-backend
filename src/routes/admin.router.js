import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  deleteProfile,
  profile,
  register,
  resetPasswordRequest,
  updateProdile,
} from "../controllers/admin.controller.js";
import { isAuthenticatedUser } from "../utils/auth.js";

const adminRouter = Router();

adminRouter.post("/register", register);
adminRouter.post("/login", adminLogin);
adminRouter.get("logout", isAuthenticatedUser, adminLogout);
adminRouter.get("/profile/:id", isAuthenticatedUser, profile);
adminRouter.post("/profile-update/:id", isAuthenticatedUser, updateProdile);
adminRouter.delete("/profile-delete/:id", isAuthenticatedUser, deleteProfile);
adminRouter.post("/reset-password-request", resetPasswordRequest);
export default adminRouter;
