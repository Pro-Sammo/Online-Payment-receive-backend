import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const teacherSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);


teacherSchema.methods.comparePassword = async function (password) {
  return password == this.password;
};

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
