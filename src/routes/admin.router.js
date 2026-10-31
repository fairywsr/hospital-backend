import { Router } from "express";
import { login, profile, register } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.get("/profile/:id", profile);

export default adminRouter;
