import mongoose from "mongoose";


const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    roll: {
      type: String,
    },
    registration: {
      type: Number,
    },
    department:{
      type:String,
      enum:["cst","civil","power","mechanical","rac","electrical"]
    },
    shift:{
      type:String,
      enum:["1st","2nd"]
    },
    allpayment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
  },
  { timestamps: true }
);



const Student = mongoose.model("Student", studentSchema);
export default Student;
