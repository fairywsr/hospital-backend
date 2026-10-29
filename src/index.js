import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/connectDB.js";
import patientRouter from "./routes/patient.router.js";
import doctorRouter from "./routes/doctor.router.js";

dotenv.config({ path: ".env" });

// MVC // pattern - model view controller
// MVVM // pattern - model view - view model

const app = express();
const port = process.env.PORT || 3000;

dbConnect();

app.use(express.json()); // to read json data

// APIs
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter);
app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
