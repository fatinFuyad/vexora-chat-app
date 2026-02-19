import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async function(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token)
      throw new Error("You are not logged in! Please login to get access.");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (decoded.exp > Date.now()) {}
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) throw new Error("Unauthorized! You are not logged.");

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
};
