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

patietSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

patietSchema.methods.isPasswordCorrect = async function (password) {
  console.log("password from user", typeof password);
  console.log("Password from db", typeof this.password);
  return await bcrypt.compare(password, this.password);
};

const Patient = mongoose.model("Patient", patietSchema);
export default Patient;
