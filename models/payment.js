import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    roll: {
      type: Number,
      require: true,
    },
    registration: {
      type: Number,
      require: true,
    },
    semester: {
      type: String,
      require: true,
      enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
    },
    shift: {
      type: String,
      require: true,
      enum: ["1st", "2nd"],
    },
    feetype: {
      type: String,
      require: true,
    },
    payment_amount: {
      type: Number,
      require: true,
    },
    payment_status: {
      type: String,
      enum: ["success", "failed"],
    },
    transection_Id: {
      type: String,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
