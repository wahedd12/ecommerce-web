// ===============================
// 📦 IMPORTS
// ===============================
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";
import axios from "axios";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const db = new sqlite3.Database("./ecommerce.db");

app.use(cors());
app.use(express.json());

// ===============================
// 🧱 CREATE DATABASE TABLES
// ===============================
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    productId INTEGER,
    quantity INTEGER
  )
`);

// ===============================
// 🔐 AUTH MIDDLEWARE
// ===============================
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Invalid token:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("✅ Token verified for user:", decoded.userId);
    req.userId = decoded.userId;
    next();
  });
}

// ===============================
// 👤 SIGNUP ROUTE WITH PASSWORD VALIDATION
// ===============================
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📥 Signup attempt:", { name, email });

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  // Password validation: 1 uppercase, 8–12 chars
  const passwordRegex = /^(?=.*[A-Z]).{8,12}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8–12 characters long and contain at least 1 uppercase letter",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Password hashed successfully");

    db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword],
      function (err) {
        if (err) {
          console.error("❌ Signup DB Error:", err.message);
          if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Email already exists" });
          return res.status(500).json({ message: "Database error" });
        }

        const token = jwt.sign(
          { userId: this.lastID },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );

        console.log("✅ Signup success, new user ID:", this.lastID);
        res.json({
          message: "Signup successful",
          token,
          name,
          email,
        });
      }
    );
  } catch (err) {
    console.error("❌ Signup exception:", err.message);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ===============================
// 🔑 LOGIN ROUTE
// ===============================
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Login attempt for:", email);

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      console.error("❌ Login DB Error:", err.message);
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      console.log("⚠️ No user found with that email");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Incorrect password");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    console.log("✅ Login success for:", user.email);
    res.json({
      message: "Login successful",
      token,
      name: user.name,
      email: user.email,
    });
  });
});

// ===============================
// 🛒 ADD OR UPDATE CART
// ===============================
app.post("/cart", authenticate, (req, res) => {
  const { productId, quantity } = req.body;

  console.log("=== Add to Cart Request ===");
  console.log("User ID:", req.userId);
  console.log("Product ID:", productId);
  console.log("Quantity:", quantity);

  db.get(
    `SELECT * FROM carts WHERE userId = ? AND productId = ?`,
    [req.userId, productId],
    (err, row) => {
      if (err) {
        console.error("DB Error (SELECT):", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (row) {
        db.run(
          `UPDATE carts SET quantity = ? WHERE id = ?`,
          [quantity, row.id],
          (err) => {
            if (err) {
              console.error("DB Error (UPDATE):", err);
              return res.status(500).json({ message: "Failed to update cart" });
            }
            res.json({ message: "Cart updated" });
          }
        );
      } else {
        db.run(
          `INSERT INTO carts (userId, productId, quantity) VALUES (?, ?, ?)`,
          [req.userId, productId, quantity || 1],
          function (err) {
            if (err) {
              console.error("DB Error (INSERT):", err);
              return res.status(500).json({ message: "Failed to add to cart" });
            }
            res.json({ message: "Added to cart" });
          }
        );
      }
    }
  );
});

// ===============================
// 📦 FETCH CART ITEMS
// ===============================
app.get("/cart", authenticate, (req, res) => {
  console.log("📦 Fetching cart for user:", req.userId);
  db.all(`SELECT * FROM carts WHERE userId = ?`, [req.userId], (err, rows) => {
    if (err) {
      console.error("DB Error (GET):", err);
      return res.status(500).json({ message: "Failed to load cart" });
    }
    res.json(rows);
  });
});

// ===============================
// ❌ DELETE CART ITEM
// ===============================
app.delete("/cart/:productId", authenticate, (req, res) => {
  const { productId } = req.params;

  db.run(
    `DELETE FROM carts WHERE userId = ? AND productId = ?`,
    [req.userId, productId],
    (err) => {
      if (err) {
        console.error("DB Error (DELETE):", err);
        return res.status(500).json({ message: "Failed to delete item" });
      }
      res.json({ message: "Item removed" });
    }
  );
});

// ===============================
// 💳 PAYSTACK PAYMENT VERIFICATION
// ===============================
app.post("/verify-payment", async (req, res) => {
  const { reference } = req.body;
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    console.error("❌ Paystack secret key missing!");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    console.log("💰 Payment verified:", response.data.data.status);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Payment verification failed:", err.message);
    res.status(400).json({ message: "Payment verification failed" });
  }
});

// ===============================
// 🚀 START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
