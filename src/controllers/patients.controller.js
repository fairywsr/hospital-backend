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
    res.status(500).json({
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

    const correctPassword = await user.isPasswordCorrect(String(password));
    console.log(correctPassword);

    if (!correctPassword) {
      res.status(200).json({ success: false, message: "Invalid credentials" });
    }

    return res
      .status(200)
      .json({ success: true, message: "login successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};
