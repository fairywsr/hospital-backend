import Appointment from "../models/appoinments.model.js";
import Doctor from "../models/doctor.model.js";

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
      .populate("doctor", "name specialisation phone")
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
