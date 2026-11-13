import { Router } from "express";
import {
  createAppointment,
  getPatientAppointments,
} from "../controllers/appoinments.controller.js";
import { authoriseRoles, isAuthenticatedUser } from "../utils/auth.js";

const appointmentRouter = Router();
appointmentRouter.post(
  "/new-appoinment",
  isAuthenticatedUser,
  authoriseRoles("Patient"),
  createAppointment,
);
appointmentRouter.get(
  "/all-appointments",
  isAuthenticatedUser,
  authoriseRoles("Patient"),
  getPatientAppointments,
);
export default appointmentRouter;
