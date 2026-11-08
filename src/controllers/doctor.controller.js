import Doctor from "../models/doctor.model.js";
import { sendToken } from "../utils/token.js";
import { sendMail } from "../utils/sendMail.js";
import crypto from "crypto";
// doctor register api
export const registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specilization,
      license,
      age,
      experience,
      gender,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !specilization ||
      !license ||
      !age ||
      !experience ||
      !gender
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const doctorAlreadyExist = await Doctor.findOne({
      $or: [{ email }, { license }],
    });

    console.log("line 38");

    if (doctorAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "this email or lincese already exist",
      });
    }

    console.log("line 49");
    const doctor = await Doctor.create({
      name,
      email,
      password,
      phone,
      specilization,
      license,
      age,
      experience,
      gender,
    });

    console.log("line 68");
    return res.status(200).json({
      success: true,
      message: "Your profile created successfully",
      doctor,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error.name, "-", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "All fields are required",
      });
    }

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordCorrect = await doctor.isPasswordCorrect(password);

    if (!passwordCorrect) {
      return res.status(200).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const message = "doctor login successfully";
    return sendToken(doctor, 200, res, message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "Internal server error",
      error: error,
    });
  }
};

export const doctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const user = await Doctor.findById(id);
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      Doctor: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!doctor) {
      return res.status(400).json({
        success: true,
        message: "Profile nt found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "profile updated successfuly",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    console.log(doctor);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    if (!doctors) {
      return res.status(400).json({
        success: false,
        message: "Doctors not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All doctors found successfully",
      doctors,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      success: true,
      message: "All doctors found successfully",
    });
  }
};

export const doctorLogout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expireIn: new Date(Date.now()),
      httpOnlt: true,
    });

    return res.status(200).json({
      sucess: true,
      message: "Doctor logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(500).json({
        success: false,
        message: "invalid email",
      });
    }

    console.log(`line 248 ${doctor}`);
    let resetToken = await doctor.resetPassword();
    console.log("resetToken-250", resetToken);
    await doctor.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `if You want to reset Your Password please click on this link ${resetPasswordURL}`;
    console.log("line 252", doctor.email);

    await sendMail({
      email: doctor.email,
      subject: "Reset Password Request",
      message,
    });

    return res.status(200).json({
      success: true,
      message: `email send successfully to ${doctor.email}`,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const doctor = await Doctor.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!doctor) {
      return res.status(200).json({
        success: false,
        message: "Invalid token or time has been expired",
      });
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(409).json({
        success: false,
        message: "password and confirm password dont matched",
      });
    }

    doctor.password = password;
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpire = undefined;
    await doctor.save();
    return res.status(200).json({
      success: true,
      message: "Password update successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
