import { Router } from "express";
import {
  approveAppointment,
  cancelAppointment,
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  rejectAppointment,
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
appointmentRouter.get(
  "/doctor-appointments",
  isAuthenticatedUser,
  authoriseRoles("Doctor"),
  getDoctorAppointments,
);
appointmentRouter.put(
  "/approve/:id",
  isAuthenticatedUser,
  authoriseRoles("Doctor"),
  approveAppointment,
);
appointmentRouter.put(
  "/rejected:/id",
  isAuthenticatedUser,
  authoriseRoles("Doctor"),
  rejectAppointment,
);
appointmentRouter.put(
  "/cancel:/id",
  isAuthenticatedUser,
  authoriseRoles("Doctor"),
  cancelAppointment,
);
export default appointmentRouter;
