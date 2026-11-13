import Appointment from "../models/appoinments.model.js";
import Doctor from "../models/doctor.model.js";

// patient
export const createAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, reason } = req.body;

    if (!doctor || !appointmentDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const findDoctor = await Doctor.findById(doctor);

    if (!findDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      appointmentDate,
      reason,
    });

    res.status(200).json({
      success: true,
      message: "appoinment created successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate("doctor", "name specilization phone")
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      message: "All appointments fetch successfully",
      appointments,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    })
      .populate("patient", "name email phone age disease")
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      message: "Doctor appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    console.log(error.name);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
      status: "Pending",
    });
    console.log(appointment, 96);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "pending appointment not found",
      });
    }

    ((appointment.status = "Approve"), await appointment.save());

    return res.status(200).json({
      success: false,
      message: "Appointment approve successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
      status: "Pending",
    });

    if (!appointment) {
      return res.json({
        success: true,
        message: "No appointment found",
      });
    }

    ((appointment.status = "Rejected"), await appointment.save());

    return res.status(200).json({
      success: true,
      message: "Appointment rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
      status: "Pending",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        mesage: "Appointment not found",
      });
    }

    ((appointment.status = "Cancel"), await appointment.save());
    return res.status(200).json({
      success: false,
      message: "Appointment cancel successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// admin
export const getAllAppointmentsAdmin = async (req, res) => {
  try {
    const allAppointments = await Appointment.find()
      .populate("patient", "name email phone age disease")
      .populate("doctor", "name email phone specilization");
    console.log(allAppointments, 183);
    if (!allAppointments) {
      return res.status(404).json({
        success: false,
        message: "Appointments not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      allAppointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
