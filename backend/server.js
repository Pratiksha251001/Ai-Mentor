// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, sequelize } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
//import discussionRoutes from "./routes/discussionRoutes.js"; // Replaced by communityRoutes.js
import analyticsRoutes from "./routes/analyticsRoutes.js";
import sidebarRoutes from "./routes/sidebarRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import "./models/CommunityPost.js";
import contactRoutes from "./routes/contactus.js";
import "./models/ContactMessage.js";
dotenv.config();
const app = express();
/*
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // ⚠️ React/Vite apps me issue avoid
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // ⚠️ Dev mode React ke liye needed
          "https://apis.google.com",
        ],

        styleSrc: ["'self'", "'unsafe-inline'"],

        imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com"],

        connectSrc: [
          "'self'",
          process.env.ALLOWED_ORIGIN,
          "ws://localhost:*", // ⚠️ Vite hot reload fix
        ],

        fontSrc: ["'self'", "https://fonts.gstatic.com"],

        objectSrc: ["'none'"],

        frameAncestors: ["'none'"],

        upgradeInsecureRequests: [],
      },
    },
  }),
);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/videos", express.static(path.join(__dirname, "videos")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/uploads", express.static("uploads"));

// ✅ REGISTER ROUTES (CORRECT PLACE)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
//app.use("/api/discussions", discussionRoutes);   // Replaced by communityRoutes
app.use("/api/analytics", analyticsRoutes);
app.use("/api/sidebar", sidebarRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/contact", contactRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDB();
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synced successfully");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
