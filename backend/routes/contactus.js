import express from "express";
import ContactMessage from "../models/contactMessage.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, email, subject, message } = req.body;

    // Database mein create karne ki koshish
    const newMessage = await ContactMessage.create({
      userId: userId || null,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      id: newMessage.id,
    });
  } catch (error) {
    // Agar Sequelize validation fail hoti hai
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    console.error(" Server Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
