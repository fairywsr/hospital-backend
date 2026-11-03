import { Router } from "express";
import {
  deleteProfile,
  login,
  profile,
  register,
  updateProdile,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.get("/profile/:id", profile);
adminRouter.post("/profile-update/:id", updateProdile);
adminRouter.delete("/profile-delete/:id", deleteProfile);

export default adminRouter;
