import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/admin.route.js";
import doctorRouter from "./routes/doctor.route.js";
import userRouter from "./routes/user.route.js";

//app config

const app = express();

// const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

//middlewares
app.use(express.json());

// app.use(cors());
const allowedOrigins = [
  "https://patient-doctor-scheduling-platform-tau.vercel.app",
  "https://patient-doctor-scheduling-platform-liart.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174", // vite local dev
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


//api endpoints

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user",userRouter);

app.get("/", (req, res) => {
  res.send("API WORKING FINE");
});

// app.listen(port, () => console.log("Server started", port));

export default app;
