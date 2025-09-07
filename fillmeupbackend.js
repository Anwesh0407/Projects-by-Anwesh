// fillmeupbackend.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// ======================
// MONGODB CONNECTION
// ======================
// const MONGO_URI =
//   "mongodb+srv://hackodisha:hackodisha@cluster001.ji5m4cg.mongodb.net/fillmeup?retryWrites=true&w=majority&appName=Cluster001";
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ======================
// MONGOOSE SCHEMA
// ======================
const profileSchema = new mongoose.Schema(
  {
    fullName: String,
    fatherName: String,
    dob: String,
    gender: String,
    nationality: String,
    religion: String,
    maritalStatus: String,
    bloodGroup: String,
    aadhaarNumber: { type: String, trim: true }, // store as string
    panNumber: { type: String, trim: true },
    passportNumber: { type: String, trim: true },
    identificationMark: String,
    photo: String, // store file path
    documents: [String], // store multiple file paths
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

// ======================
// MULTER CONFIG (File Uploads)
// ======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ======================
// ROUTES
// ======================

// POST route to save profile
app.post(
  "/api/profiles",
  upload.fields([
    { name: "photo-upload", maxCount: 1 },
    { name: "document-upload", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      console.log("📥 Incoming profile data:", req.body);

      const {
        fullName,
        fatherName,
        dob,
        gender,
        nationality,
        religion,
        maritalStatus,
        bloodGroup,
        aadhaarNumber,
        panNumber,
        passportNumber,
        identificationMark,
      } = req.body;

      const photo = req.files["photo-upload"]
        ? req.files["photo-upload"][0].path
        : null;

      const documents = req.files["document-upload"]
        ? req.files["document-upload"].map((file) => file.path)
        : [];

      const newProfile = new Profile({
        fullName: fullName?.trim(),
        fatherName: fatherName?.trim(),
        dob,
        gender,
        nationality,
        religion,
        maritalStatus,
        bloodGroup,
        aadhaarNumber: aadhaarNumber?.trim(), // ensure string
        panNumber: panNumber?.trim(),
        passportNumber: passportNumber?.trim(),
        identificationMark,
        photo,
        documents,
      });

      const savedProfile = await newProfile.save();
      console.log("✅ Saved profile:", savedProfile);
      res.json({ success: true, profile: savedProfile });
    } catch (err) {
      console.error("❌ Save error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to save profile" });
    }
  }
);

// GET latest profile
app.get("/api/profiles/latest", async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 }); // latest
    if (!profile) {
      return res.json({ success: false, message: "No profile found" });
    }
    res.json({ success: true, profile });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch profile" });
  }
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);






