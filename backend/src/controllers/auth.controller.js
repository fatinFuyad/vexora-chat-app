import bcrypt from "bcryptjs";
import { uploadImage } from "../lib/cloudinary.js";
import { generateSetToken } from "../lib/generateSetToken.js";
import { User } from "../models/user.model.js";

export async function signup(req, res) {
  try {
    const { email, password, fullName } = req.body; // while signing up there will be no profile photo
    if (!password) throw new Error("Passsword is required!");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });
    user.password = undefined;

    // ...user._doc, // if we spread the object then all of the inherited propeties will also be copied. but if we don't spread then only the doc of the object is copied.
    // while sending the spread object to the client the inherited properties are not sent!.

    // Generate and set token to the response
    await generateSetToken(user._id, res);
    res.status(201).json({
      status: "success",
      message: "signup completed successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message:
        error.code === 11000 && error.keyPattern.email
          ? "There's already an user with the email address. Please try using another"
          : error.message
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Invalid credentials provided!");
    const user = await User.findOne({ email });
    if (!user) throw new Error("There's no user with the credentials");

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      throw new Error("Invalid credentials provided! Try again later.");

    const token = await generateSetToken(user._id, res);

    res.status(200).json({
      status: "success",
      message: "login completed successfully",
      token,
      user: { ...user._doc, password: undefined }
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
}

export async function logout(req, res) {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // res.clearCookie("jwt")
    // sending an empty token as jwt cookie for logging out user

    res.status(200).json({
      status: "success",
      message: "logout completed successfully",
      user: null
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message || "Something went wrong while logging out!"
    });
  }
}

export async function checkAuth(req, res) {
  try {
    res.status(200).json({
      status: "success",
      message: "User authentication is successfull",
      user: req.user
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const { user } = req;
    const { profilePic, fullName } = req.body;
    if (fullName) user.fullName = req.body.fullName;
    if (profilePic) {
      user.profilePic = await uploadImage(profilePic, "users");
    }

    // const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
    //   new: true
    // });

    const updatedUser = await user.save(); // save doesn't return the password field but findByIdAndUpdate method will return it

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}
