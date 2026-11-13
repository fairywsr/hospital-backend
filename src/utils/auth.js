import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Admin from "../models/admin.model.js";

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log(req.cookies?.token, "line 9 in isAuthenticated");
    console.log(token, "in auth 9");
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please login ",
      });
    }

    const decodedData = jwt.verify(token, process.env.secretKey);
    console.log(decodedData, "18");
    let user;
    if (decodedData.role === "Doctor") {
      user = await Doctor.findById(decodedData.id);
    } else if (decodedData.role === "Patient") {
      user = await Patient.findById(decodedData.id);
    } else if (decodedData.role === "Admin") {
      user = await Admin.findById(decodedData.id);
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found inValid id",
      });
    }

    req.user = user;
    req.userRole = decodedData.role;
  } catch (error) {
    console.log(error);
    console.log(error.name);
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
  next();
};

export const authoriseRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        success: false,
        message: "You are not authorised to access this role",
      });
    }
    next();
  };
};
