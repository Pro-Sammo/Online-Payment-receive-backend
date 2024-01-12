import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import Student from "../models/student.js";
import Teacher from "../models/teacher.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { StudentAuthToken, AdminAuthToken } = req.cookies;

    if (!StudentAuthToken && !AdminAuthToken)
      return next(new ErrorHandler("Not Logged In", 401));

    if (StudentAuthToken) {
      const decoded = jwt.verify(StudentAuthToken, process.env.JWT_SECRET);
      req.student = await Student.findById(decoded._id);
    } else if (AdminAuthToken) {
      const decoded = jwt.verify(AdminAuthToken, process.env.JWT_SECRET);
      req.admin = await Teacher.findById(decoded._id);
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
