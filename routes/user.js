import express from "express";
import {
  StudentLogin,
  TeacherRegister,
  adminLogin,
  changeRole,
  deleteStudent,
  getAllAdmin,
  getAllStudent,
  getMyProfile,
  logout,
  searchStudent,
  studentRegister,
  updateStudentProfile,
  verifyToken,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/teacherregister").post(TeacherRegister);
router.route("/studentregister").post(studentRegister);
router.route("/studentlogin").post(StudentLogin);
router.route("/teacherlogin").post(adminLogin);
router.route("/logout").get(logout);
router.route("/getmyprofile").get(isAuthenticated, getMyProfile);
router.route("/verifytoken").post(verifyToken);
router.route("/searchstudent/:id").get(searchStudent);
router.route("/getallstudent").get(getAllStudent);
router.route("/deletestudent").get(deleteStudent);
router.route("/updatestudentprofile/:id").put(updateStudentProfile);
router.route("/getalladmin").get(getAllAdmin);
router.route("/changeadminrole").get(changeRole);

export default router;
