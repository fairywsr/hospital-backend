import Admin from "../models/admin.model.js";
import { sendToken } from "../utils/token.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check is user already exist with this email
    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "user already exist",
      });
    }

    // create admin in db
    const user = await Admin.create({ name, email, password });

    return res.status(200).json({
      success: true,
      message: "Admin registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    console.log("52");
    // search user in db..
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    console.log("62");
    // check user password is correct
    const correctPassword = await admin.isPasswordCorrect(password);

    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        message: "inValid credentials.",
      });
    }

    const message = "admin login successfully";
    console.log("75");
    return sendToken(admin, 200, res, message);
    // return res.status(200).json({
    //   success: true,
    //   message: "User login in successfully",
    //   user,
    // });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Admin.findById(id);
    if (!profile) {
      return res.status(400).json({
        success: true,
        message: "Profile not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProdile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid id Profile not found",
      });
    }

    const user = await Admin.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    console.log(user);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error.name);
    return res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id, Profile not found",
      });
    }

    const user = await Admin.findByIdAndDelete(id);
    console.log(user);
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.log(error.name);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expireIn: new Date(Date.now()),
      httpOnlt: true,
    });

    return res.status(200).json({
      sucess: true,
      message: "Admin logout successfully",
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

    const admin = Admin.findOne({ email });
    if (!admin) {
      return res.status(500).json({
        success: false,
        message: "invalid email",
      });
    }

    let resetToken = await admin.resetPassword();
    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password${resetToken}`;
    const message = `if You want to reset Your Password please click on this link ${resetPasswordURL}`;

    await sendMail({
      email: admin.email,
      subject: "Reset Password Request",
      message,
    });

    return res.status(200).json({
      success: true,
      message: `email send successfully to ${admin.email}`,
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
