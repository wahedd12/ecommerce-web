// server.mjs
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

// ------------------------------
// Load environment variables
// ------------------------------
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const CLIENT_URL = process.env.CLIENT_URL || "https://waspomind.vercel.app";

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

const app = express();
app.use(express.json());

// ------------------------------
// CORS Configuration
// ------------------------------
const allowedOrigins = [
  CLIENT_URL, // production frontend
  "https://waspomind.vercel.app",
  "http://localhost:5173", // local dev
];

// Regex to allow any Vercel preview deployments
const vercelPreviewRegex = /^https:\/\/ecommerce-[a-z0-9-]+(-[a-z0-9-]+)*-wahedd12s-projects\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / curl / server-side
    if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
      return callback(null, true);
    }
    console.warn("🚫 Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ------------------------------
// MongoDB Connection
// ------------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------------
// User Schema & Model
// ------------------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetToken: String,
  resetTokenExpiration: Date,
});
const User = mongoose.model("User", userSchema);

// ------------------------------
// Cart Schema & Model
// ------------------------------
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: String,
      quantity: Number,
      price: Number,
    },
  ],
});
const Cart = mongoose.model("Cart", cartSchema);

// ------------------------------
// JWT Helper
// ------------------------------
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

// Middleware to protect routes
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ------------------------------
// Routes
// ------------------------------

// Root
app.get("/", (req, res) => res.send("Waspomind backend is running ✅"));

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password || "", 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user);
    return res.json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    return res.json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

// ------------------------------
// Cart Routes
// ------------------------------

// Get cart
app.get("/cart", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
    return res.json(cart.items);
  } catch (err) {
    console.error("Fetch cart error:", err);
    return res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// Add / update item
app.post("/cart", authenticate, async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: "Invalid data" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });

    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price });
    }

    await cart.save();
    return res.json(cart.items);
  } catch (err) {
    console.error("Cart update error:", err);
    return res.status(500).json({ message: "Cart update failed" });
  }
});

// Remove item
app.delete("/cart/:productId", authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();
    return res.json(cart.items);
  } catch (err) {
    console.error("Cart delete error:", err);
    return res.status(500).json({ message: "Cart removal failed" });
  }
});

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
