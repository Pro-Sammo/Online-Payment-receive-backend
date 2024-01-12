import { ObjectId } from "bson";
import Payment from "../models/payment.js";
import Student from "../models/student.js";
import SSLCommerzPayment from "sslcommerz-lts";
import ErrorHandler from "../utils/errorHandler.js";

export const paymentSubmit = async (req, res, next) => {
  try {
    const { email, semester, shift, feetype, amount } = req.body;

    const student = await Student.findById(req.student._id);

    const tran_id = new ObjectId().toString();

    const store_id = process.env.STORE_ID;
    const store_password = process.env.STORE_PASSWORD;
    const is_live = false;

    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `http://localhost:5000/api/v1/payment/success/${tran_id}`,
      fail_url: "http://localhost:3030/fail",
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: student.name,
      cus_email: email,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    await Payment.create({
      email,
      name: student.name,
      roll: student.roll,
      registration: student.registration,
      semester,
      shift,
      feetype,
      payment_amount: amount,
      transection_Id: tran_id,
      payment_status: "failed",
    });
    const sslcz = new SSLCommerzPayment(store_id, store_password, is_live);
    sslcz.init(data).then(async (apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      console.log(GatewayPageURL)
      res.send({ url: GatewayPageURL });
    });
  } catch (error) {
    console.log(error);
  }
};

export const paymentSuccess = async (req, res, next) => {
  console.log(req.params.tranId);
  const createdPayment = await Payment.findOne({
    transection_Id: req.params.tranId,
  });
  console.log(createdPayment);
  createdPayment.payment_status = "success";
  await createdPayment.save();

  const student = await Student.findById(req.student._id);

  if (student) {
    student.allpayment.push(createdPayment._id);

    await student.save();
  }

  console.log(createdPayment);
  res.redirect(`http://localhost:3000/`);
};

export const deleteTransection = async (req, res, next) => {
  try {
    const transection = await Payment.findByIdAndDelete(req.params.id);
    if (!transection)
      return next(new ErrorHandler("Invalid Transection Id", 400));
    res.status(200).json({
      success: true,
      message: "Transection have been Deleted",
    });
  } catch (error) {
    throw new error();
  }
};

export const getAllTransection = async (req, res, next) => {
  try {


  let page = req.query.page;
  let rowPerPage = 10;
  const count = await Payment.countDocuments({});
    const skipCount = (page - 1) * rowPerPage;
    let query = Payment.find()
      .limit(rowPerPage)
      .skip(skipCount)

    if (count - skipCount < rowPerPage) {
      const remaining = count - skipCount;
      query = Payment.find()
        .skip(skipCount)
        .limit(remaining)
    }

    




    const allTheTransection = await query.exec();
    if (!allTheTransection)
      return next(new ErrorHandler("No Transection Available", 400));
    res.status(200).json({
      success: true,
      count:count,
      allTheTransection,
    });
  } catch (error) {
    console.log(error)
  }
};

export const deleteAllTheTransection = async (req, res, next) => {

  const result = await Payment.deleteMany();
  if (result) {
    res.status(200).json({
      success: true,
      message: "All The Transection Deleted",
    });
  }
};
