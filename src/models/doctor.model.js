import mongoose from "mongoose";
import { doctorsProfileStatus, DOCTORSTYPES, GENDERS } from "../constants";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      min: 999999999999,
      required: true,
    },
    specilization: {
      type: String,
      enum: DOCTORSTYPES,
      default: "Cardiologist",
      required: true,
    },
    license: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      max: 80,
      min: 25,
    },
    experience: {
      required: true,
      type: Number,
    },
    gender: {
      enum: GENDERS,
      default: "Male",
      required: true,
    },
    status: {
      enum: doctorsProfileStatus,
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("doctor", doctorSchema);
export default Doctor;
