import express from "express";
import { deleteAllTheTransection, deleteTransection, getAllTransection, paymentSubmit, paymentSuccess } from "../controllers/payment.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.route("/payment").post(isAuthenticated,paymentSubmit);
router.route("/payment/success/:tranId").post(isAuthenticated,paymentSuccess);
router.route("/deletetransection/:id").delete(deleteTransection);
router.route("/getalltransction").get(getAllTransection);
router.route("/deletealltransection").delete(deleteAllTheTransection);

export default router;
