import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/connectDB.js";
import patientRouter from "./routes/patient.router.js";
import doctorRouter from "./routes/doctor.router.js";
import adminRouter from "./routes/admin.router.js";
import cookieParser from "cookie-parser";
import appointmentRouter from "./routes/appoinments.router.js";
import cors from "cors";
dotenv.config({ path: ".env" });

// MVC // pattern - model view controller
// MVVM // pattern - model view - view model

const app = express();
const port = process.env.PORT || 3000;

dbConnect();

const options = {
  origin: [
    "https://hospital-frontend-nine-nu.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(options));
app.use(express.json()); // to read json data
app.use(cookieParser());

// APIs
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/appointments", appointmentRouter);

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
