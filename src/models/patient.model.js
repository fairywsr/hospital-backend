import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { BLOOD_GROUPS, GENDERS } from "../constants.js";
const patietSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
      default: BLOOD_GROUPS[0],
    },
    disease: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

patietSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

patietSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Patient = mongoose.model("Patient", patietSchema);
export default Patient;
