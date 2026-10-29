import Doctor from "../models/doctor.model.js";

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
        error: error.message,
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
