import jwt, { decode } from "jsonwebtoken";
import User from '../models/user.model.js';
import AppError from "../utils/appError.js";
import asyncHandler from "./asyncHandler.middleware.js";


export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  
   const {token} = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmUzMzZhMDBlZmQ3ODcwMzYyZjk2OSIsInJvbGUiOiJVU0VSIiwic3Vic2NyaXB0aW9uIjp7ImlkIjoic3ViX080bGxoWFZHV2V3V1JrIiwic3RhdHVzIjoiYWN0aXZlIn0sImlhdCI6MTcxNDgxMzU0MSwiZXhwIjoxNzE1NDE4MzQxfQ.IW5Bhv_jHX3IvXXxG9YmmYD_R_CmkC0ryAAe17FdjW0";
  //  const user = await User.findOne({ email })
  //  const token = await user.generateJWTToken();
 
  console.log("Token"+token);

  // If no token send unauthorized message
  if (!token) {
    return next(new AppError("Unauthorized, please login to continue", 401));
  }

  // Decoding the token using jwt package verify method
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  console.log("decode"+ decoded);

  // If no decode send the message unauthorized
  if (!decoded) {
    return next(new AppError("Unauthorized, please login to continue", 401));
  }

  // If all good store the id in req object, here we are modifying the request object and adding a custom field user in it
  req.user = decoded;

  // Do not forget to call the next other wise the flow of execution will not be passed further
  next();
});

// Middleware to check if user is admin or not
export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to view this route", 403)
      );
    }

    next();
  });

// Middleware to check if user has an active subscription or not
export const authorizeSubscribers = asyncHandler(async (req, _res, next) => {
  // If user is not admin or does not have an active subscription then error else pass
  if (req.user.role !== "ADMIN" && req.user.subscription.status !== "active") {
    return next(new AppError("Please subscribe to access this route.", 403));
  }

  next();
});
