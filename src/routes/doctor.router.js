import { Router } from "express";
import {
  deleteProfile,
  doctorProfile,
  editProfile,
  getAllDoctors,
  loginDoctor,
  registerDoctor,
} from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.post("/register-doctor", registerDoctor);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/profile/:id", doctorProfile);
doctorRouter.put("/update-profile/:id", editProfile);
doctorRouter.delete("/delete-profile/:id", deleteProfile);
doctorRouter.get("/all-doctors", getAllDoctors);
export default doctorRouter;
