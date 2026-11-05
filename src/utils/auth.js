import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Admin from "../models/admin.model.js";

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies();
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please login ",
      });
    }

    const decodedData = jwt.verify(token, process.env.secretKey);
    let user;
    if (decodedData.role === "Doctor") {
      user = await Doctor.findById(decodedData.id);
    } else if (decodedData.role === "patient") {
      user = await Patient.findById(decodedData.id);
    } else if (decodedData.role === "admin") {
      user = await Admin.findById(decodedData.id);
    }

    if (!user) {
      res.status(400).json({
        success: false,
        message: "user not found inValid id",
      });
    }

    req.user = user;
    req.userRoke = decodedData.Role;
  } catch (error) {
    console.log(error);
    console.log(error.name);
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
