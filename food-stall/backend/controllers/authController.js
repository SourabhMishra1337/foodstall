const axios = require("axios");

const sendOTP = async (req, res) => {

  console.log("=================================");
  console.log("SEND OTP REQUEST RECEIVED");
  console.log("BODY:", req.body);
  console.log("=================================");

  try {

    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const cleanMobile = mobile.replace(/\D/g, "");

    if (
      cleanMobile.length !== 12 ||
      !cleanMobile.startsWith("91")
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid Indian mobile number",
      });
    }

    console.log("Sending OTP to:", cleanMobile);

    const response = await axios.get(
      "https://control.msg91.com/api/v5/otp",
      {
        params: {
          mobile: cleanMobile,
        },

        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          accept: "application/json",
        },
      }
    );

    console.log("=================================");
    console.log("MSG91 RESPONSE:");
    console.log(response.data);
    console.log("=================================");

    return res.status(200).json({
      success: true,
      message: "OTP request sent",
      data: response.data,
    });

  } catch (error) {

    console.log("=================================");
    console.log("MSG91 ERROR:");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    } else {
      console.log("MESSAGE:", error.message);
    }

    console.log("=================================");

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "Unable to send OTP",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    const cleanMobile = mobile.replace(/\D/g, "");

    const url =
      `https://control.msg91.com/api/v5/otp/verify` +
      `?mobile=${cleanMobile}` +
      `&otp=${otp}`;

    const response = await axios.get(url, {
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "VERIFY OTP ERROR:",
      error.response?.data || error.message
    );

    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};