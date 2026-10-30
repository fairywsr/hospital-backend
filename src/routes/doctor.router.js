import { Router } from "express";
import {
  doctorProfile,
  loginDoctor,
  registerDoctor,
} from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.post("/register-doctor", registerDoctor);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/profile/:id", doctorProfile);
export default doctorRouter;
