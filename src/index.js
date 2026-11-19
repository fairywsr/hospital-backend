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

const corsOptions = {
  origin: [process.env.frontendURL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["content-type", "Authorization"],
  credentials: true,
  maxAge: 600,
};

app.use(cors(corsOptions));
app.use(express.json()); // to read json data
app.use(cookieParser());
// APIs
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointments", appointmentRouter);

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
