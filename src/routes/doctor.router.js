import { Router } from "express";
import { registerDoctor } from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.post("/register-doctor", registerDoctor);

export default doctorRouter;
