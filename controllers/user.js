import Teacher from "../models/teacher.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendTokenForAdmin, sendTokenForStudent } from "../utils/sendToken.js";
import Student from "../models/student.js";
import jwt from "jsonwebtoken";

export const TeacherRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password)
      return next(new ErrorHandler("Please enter all field"), 400);

    let user = await Teacher.findOne({ email });

    if (user) return next(new ErrorHandler("Admin Already Exist", 409));

    user = await Teacher.create({
      email,
      name,
      password,
    });

    res.status(200).json({
      success: true,
      message: "New Admin Create Successful",
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentLogin = async (req, res, next) => {
  try {
    const { registration, roll } = req.body;
    if (!registration || !roll)
      return next(new ErrorHandler("Please enter all field"), 400);
    let user = await Student.findOne({ registration: registration });
    console.log(user);
    if (!user)
      return next(new ErrorHandler("Incorrect registration or roll", 401));
    const isMatch = roll == user.roll;

    if (!isMatch) {
      return next(new ErrorHandler("Incorrect registration or roll", 401));
    }
    sendTokenForStudent(res, user, "Login successful", 200);
  } catch (error) {
    console.log(error);
  }
};

export const studentRegister = async (req, res, next) => {
  try {
    const { registration, roll, name, department, shift } = req.body;
    if ((!registration || !roll || !name, !department || !shift))
      return next(new ErrorHandler("Please enter all field"), 400);
    let user = await Student.create({
      name,
      roll,
      registration,
      department,
      shift,
    });
    res.status(200).json({
      success: true,
      message: "Create Successful",
    });
  } catch (error) {
    console.log(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please Enter all Field", 400));

    const user = await Teacher.findOne({ email: email }).select("+password");

    if (!user)
      return next(new ErrorHandler("Incorrect Email or Password", 401));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect Email or Password", 401));
    }
    sendTokenForAdmin(res, user, "Admin Login successful", 200);
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { StudentAuthToken, AdminAuthToken } = req.cookies;
    if (StudentAuthToken) {
      res
        .status(200)
        .cookie("StudentAuthToken", "", {
          expires: new Date(Date.now() - 1000),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({
          success: true,
          message: "Logged out Successfully",
        });
    }
    if (AdminAuthToken) {
      res
        .status(200)
        .cookie("AdminAuthToken", "", {
          expires: new Date(Date.now() - 1000),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({
          success: true,
          message: "Logged out Successfully",
        });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    if (req.student) {
      let user = await Student.findById(req.student._id).populate("allpayment");
      res.status(200).json({
        success: true,
        user,
      });
    } else if (req.admin) {
      let user = await Teacher.findById(req.admin._id);
      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Teacher.findById(decoded._id);
    res.status(201).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllStudent = async (req, res, next) => {
  try {
    let page = req.query.page;
    let rowPerPage = req.query.rowperpage;
    const roll = req.query.roll;
    const count = await Student.countDocuments({});
    const skipCount = (page - 1) * rowPerPage;
    let query = Student.find({ roll: { $regex: roll } })
      .limit(rowPerPage)
      .skip(skipCount)
      .populate("allpayment");

    if (count - skipCount < rowPerPage) {
      const remaining = count - skipCount;
      query = Student.find({ roll: { $regex: roll } })
        .skip(skipCount)
        .limit(remaining)
        .populate("allpayment");
    }

    const user = await query.exec();
    res.status(200).json({
      count: count,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  const id = req.query.id;
  const user = await Student.findByIdAndDelete({ _id: id });
  if (!user) return next(new ErrorHandler("Invalid Student Id", 400));
  res.status(200).json({
    success: true,
    message: `${user.name}'s account has been deleted`,
  });
};

export const searchStudent = async (req, res, next) => {
  try {
    const user = await Student.findById(req.params.id);
    if (!user) return next(new ErrorHandler("Invalid Student Id", 400));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error) return next(new ErrorHandler("Invalid Student Id", 400));
  }
};

export const updateStudentProfile = async (req, res, next) => {
  try {
    const { name, shift, department } = req.body;
    if (!name || !shift || !department)
      return next(new ErrorHandler("Please Enter All Field", 400));
    const user = await Student.findById(req.params.id);
    if (!user) return next(new ErrorHandler("Invalid Student Id", 400));
    user.name = name;
    user.shift = shift;
    user.department = department;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Update Successful",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllAdmin = async (req, res, next) => {
  try {
    const admin = await Teacher.find({});
    if (!admin) return next(new ErrorHandler("No Admin Available", 400));

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.log(error);
  }
};

export const changeRole = async (req, res, next) => {
  try {
    const admin = await Teacher.findById(req.query.id);
    console.log(admin)
    if (!admin) return next(new ErrorHandler("Invalid Admin Id", 400));
    if (admin.role === "user") {
      admin.role = "admin";
    } else if (admin.role === "admin") {
      admin.role = "user";
    }
    admin.save();
    res.status(201).json({
      success: true,
      message: "Role Changed Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
