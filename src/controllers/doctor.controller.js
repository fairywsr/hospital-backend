import Doctor from "../models/doctor.model.js";
import isPasswordCorrect from "../models/doctor.model.js";
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
    console.log(req.body);
    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "All fields are required",
      });
    }
    console.log(84);
    const user = await Doctor.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(93);
    const passwordCorrect = await user.isPasswordCorrect(password);

    if (!passwordCorrect) {
      return res.status(200).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    console.log(102);
    return res.status(200).json({
      success: true,
      message: "user Login in successfully",
      user: user,
    });
  } catch (error) {
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
