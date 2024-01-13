import Teacher from "../models/teacher.js";
import Student from "../models/student.js";
import jwt from "jsonwebtoken";

export const sendTokenForAdmin = (res, user, message, statusCode = 200) => {
  let token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None",
    domain: "https://online-payment-receive-frontend.vercel.app",
  };
  res.status(statusCode).cookie("AdminAuthToken", token, options).json({
    success: true,
    message: message,
  });
};

export const sendTokenForStudent = (res, user, message, statusCode = 200) => {
  let token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  res.status(statusCode).cookie("StudentAuthToken", token, options).json({
    success: true,
    message: message,
  });
};
