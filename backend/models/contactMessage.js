import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ContactMessage = sequelize.define(
  "ContactMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "Invalid email format" }, // Check if it's a real email
        notEmpty: { msg: "Email is required" },
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Subject cannot be empty" },
        len: {
          args: [3, 100],
          msg: "Subject must be between 3 and 100 characters",
        },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Message cannot be empty" },
        len: {
          args: [10, 2000],
          msg: "Message must be at least 10 characters long",
        },
      },
    },
  },
  {
    tableName: "contact_messages",
    timestamps: true,
  },
);

export default ContactMessage;
