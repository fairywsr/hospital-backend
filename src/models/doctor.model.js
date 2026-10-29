import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { doctorsProfileStatus, DOCTORSTYPES, GENDERS } from "../constants.js";

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
      max: 999999999999,
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
      type: String,
      enum: GENDERS,
      default: "Male",
      required: true,
    },
    status: {
      type: String,
      enum: doctorsProfileStatus,
      default: "Pending",
    },
  },
  { timestamps: true },
);

doctorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

doctorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

const Doctor = mongoose.model("doctor", doctorSchema);
export default Doctor;
