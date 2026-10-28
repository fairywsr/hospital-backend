import Patient from "../models/patient.model.js";

// patient Register Api
export const registerPatient = async (req, res) => {
  const { name, email, phone, password, disease, age, gender, bloodGroup } =
    req.body;
  console.log(req.body);

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
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists already
  const existingUser = await Patient.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
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

  return res.status(201).json({ message: "User created successfully", user });
};

// Patient Login
export const patientLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await Patient.findOne({ email });

  if (!email) {
    return res.status(404).json({ message: "Invalid credentials" });
  }
};
