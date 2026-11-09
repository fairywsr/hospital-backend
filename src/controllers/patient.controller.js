import Patient from "../models/patient.model.js";
import { sendToken } from "../utils/token.js";
import crypto from "crypto";
// patient Register Api
export const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password, disease, age, gender, bloodGroup } =
      req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !disease ||
      !age ||
      !gender ||
      !bloodGroup
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user exists already
    const existingUser = await Patient.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await Patient.create({
      name,
      email,
      password,
      disease,
      age,
      gender,
      phone,
      bloodGroup,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// Patient Login
export const patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "patient not found" });
    }

    const correctPassword = await patient.isPasswordCorrect(password);
    console.log(correctPassword);

    if (!correctPassword) {
      res.status(200).json({ success: false, message: "Invalid credentials" });
    }

    const message = "patient login successfully";
    return sendToken(patient, 200, res, message);
    // return res
    //   .status(200)
    //   .json({ success: true, message: "login successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// Patient Profile
export const patientProfile = async (req, res) => {
  try {
    const { id } = req.body;

    // find user from db based on id
    const user = await Patient.findOne({ id });
    console.log(user);

    if (!user) {
      res.status(200).json({ success: false, message: "User not found" });
    }

    res.status(300).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: true, message: "internal server error", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    console.log(patient);
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "user not found against this id",
      });
    }

    return res.status(500).json({
      success: true,
      message: "Profile Updated successfully",
      patient,
    });
  } catch (error) {
    console.log(error.name);
    return res.status(500).json({
      success: false,
      message: "someThing went wrong",
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await Patient.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "profile deleted successfully",
    });
  } catch (error) {
    console.log(error.name);
    return res
      .status(500)
      .json({ success: false, message: "some thing went wrong" });
  }
};

export const allPatients = async (req, res) => {
  try {
    const allPatients = await Patient.find();
    console.log(allPatients);
    if (!allPatients) {
      return res.status(400).json({
        success: false,
        message: "Patients data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patients Fetched successfully",
      allPatients,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: true,
      message: "Internal server error",
    });
  }
};

export const patientLogout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expireIn: new Date(Date.now()),
      httpOnlt: true,
    });

    return res.status(200).json({
      sucess: true,
      message: "Patient logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const resetPasswordRequestPatient = async (req, res) => {
  try {
    const { email } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(500).json({
        success: false,
        message: "invalid email",
      });
    }

    let resetToken = await patient.resetPassword();
    await admin.save();
    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `if You want to reset Your Password please click on this link ${resetPasswordURL}`;

    await sendMail({
      email: patient.email,
      subject: "Reset Password Request",
      message,
    });

    return res.status(200).json({
      success: true,
      message: `email send successfully to ${patient.email}`,
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

export const resetPasswordPatient = async (req, res) => {
  try {
    const { token } = req.params;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const patient = await Patient.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!patient) {
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

    patient.password = password;
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpiry = undefined;
    await patient.save();

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

export const updatePasswordPatient = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "invalid Id",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm Password does not match each other",
      });
    }

    patient.password = newPassword;
    await patient.save();

    const message = "Password updated successfully";
    sendToken(patient, 200, res, message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
