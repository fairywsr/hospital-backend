import Patient from "../models/patient.model.js";

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
    console.log(req.body);
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await Patient.findOne({ email });

    console.log("line 51", user, "db user");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const correctPassword = await user.isPasswordCorrect(password);
    console.log(correctPassword);

    if (!correctPassword) {
      res.status(200).json({ success: false, message: "Invalid credentials" });
    }

    return res
      .status(200)
      .json({ success: true, message: "login successfully", user });
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
