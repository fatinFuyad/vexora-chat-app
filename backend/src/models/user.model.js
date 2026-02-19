import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide your email addresss"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Please setup a strong password"],
      minLength: [8, "Password should be at least 8 characters long"]
    },
    fullName: {
      type: String,
      requied: [true, "Please provide your fullname"]
    },
    profilePic: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
