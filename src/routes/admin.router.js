import { Router } from "express";
import {
  deleteProfile,
  login,
  profile,
  register,
  updateProdile,
} from "../controllers/admin.controller.js";
import { isAuthenticatedUser } from "../utils/auth.js";

const adminRouter = Router();

adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.get("/profile/:id", isAuthenticatedUser, profile);
adminRouter.post("/profile-update/:id", isAuthenticatedUser, updateProdile);
adminRouter.delete("/profile-delete/:id", isAuthenticatedUser, deleteProfile);

export default adminRouter;
