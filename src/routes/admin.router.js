import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  deleteProfile,
  profile,
  register,
  resetPasswordAdmin,
  resetPasswordRequestAdmin,
  updatePasswordAdmin,
  updateProdile,
} from "../controllers/admin.controller.js";
import { isAuthenticatedUser } from "../utils/auth.js";

const adminRouter = Router();

adminRouter.post("/register", register);
adminRouter.post("/login", adminLogin);
adminRouter.get("/logout", isAuthenticatedUser, adminLogout);
adminRouter.get("/profile/:id", isAuthenticatedUser, profile);
adminRouter.post("/profile-update/:id", isAuthenticatedUser, updateProdile);
adminRouter.delete("/profile-delete/:id", isAuthenticatedUser, deleteProfile);
adminRouter.post("/reset-password-request", resetPasswordRequestAdmin);
adminRouter.put("/reset-Password/:token", resetPasswordAdmin);
adminRouter.post("/update-password", isAuthenticatedUser, updatePasswordAdmin);

export default adminRouter;
