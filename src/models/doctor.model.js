import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  doctorsProfileStatus,
  DOCTORSTYPES,
  GENDERS,
  Roles,
} from "../constants.js";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
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
      type: Number,
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
    role: {
      type: String,
      enum: Roles,
      default: "Doctor",
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
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
doctorSchema.methods.getJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.secretKey,
    { expiresIn: "7d" },
  );
};

doctorSchema.methods.resetPassword = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpiry = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

const Doctor = mongoose.model("doctor", doctorSchema);
export default Doctor;
