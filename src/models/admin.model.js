import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Roles } from "../constants.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Roles,
      default: "Admin",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

adminSchema.methods.getJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.secretKey,
    {
      expiresIn: "7d",
    },
  );
};

adminSchema.methods.resetPassword = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
