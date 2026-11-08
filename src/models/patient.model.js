import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { BLOOD_GROUPS, GENDERS, Roles } from "../constants.js";
const patietSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      max: 99999999999,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: GENDERS,
    },
    age: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      default: "O+",
    },
    disease: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Roles,
      default: "Patient",
    },
    resetPasswordToken: String,
    resetPasswordExpiry: String,
  },
  { timestamps: true },
);

patietSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

patietSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

patietSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.secretKey, {
    expiresIn: "7d",
  });
};

patietSchema.methods.resetPassword = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.password = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpiry = Date.now() + 30 * 60 * 1000;
  return resetToken;
};
const Patient = mongoose.model("Patient", patietSchema);
export default Patient;
