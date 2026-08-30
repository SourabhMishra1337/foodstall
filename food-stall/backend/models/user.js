const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);