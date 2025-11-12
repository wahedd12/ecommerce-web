import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const CLIENT_URL = process.env.CLIENT_URL;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}
if (!CLIENT_URL) {
  console.warn("⚠️ WARNING: CLIENT_URL is not defined. CORS may restrict access.");
}

const app = express();
app.use(express.json());

// Updated CORS configuration
const allowedOrigins = [
  CLIENT_URL,
  "https://waspomind.vercel.app",
  "http://localhost:5173",
  "https://ecommerce-eta-peach-66.vercel.app",
  "https://ecommerce-git-master-wahedd12s-projects.vercel.app",
  "https://ecommerce-m0w7u1zyo-wahedd12s-projects.vercel.app"
];

const vercelPreviewRegex = /^https:\/\/ecommerce-.*\.vercel\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);  // allow when no origin (e.g., Postman)
    if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
      return callback(null, true);
    }
    console.warn("Blocked by CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Fix wildcard route pattern for Express v5
app.options("/*splat", cors(corsOptions));

// Database connect + port setup
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define models & helpers
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetToken: String,
  resetTokenExpiration: Date,
});
const User = mongoose.model("User", userSchema);

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Routes
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password || "", 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user);
    return res.json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

// Additional routes for login, forgot‑password, reset‑password, delete‑account go here…

app.get("/", (req, res) => res.send("Waspomind backend is running ✅"));

app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
