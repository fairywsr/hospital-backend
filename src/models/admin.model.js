import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Roles } from "../constants.js";
import jwt from "jsonwebtoken";
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Roles,
      default: "Admin",
    },
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

adminSchema.methods.getJWT = async function () {
  return await jwt.sign(
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

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
