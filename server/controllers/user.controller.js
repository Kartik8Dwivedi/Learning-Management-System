import User from "../model/user.model.js";
import AppError from "../utils/appError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { createUser, loginUser } from "../service/user.service.js";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //* 7 days
  httpOnly: true,
};

const register = async (req, res) => {
  try {
    // checking the required fields
    const { fullName, email, password } = req.body;
    const avatarFile = req.file;
    if (!fullName || !password || !email) {
      new Error("All fields are required", 400);
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      new Error("Email already exists", 400);
    }
    // Create user
    const user = await createUser({ fullName, email, password, avatarFile });

    // Set JWT token in cookie
    const token = await user.generateJWTToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User registerd successfully",
      user,
    });
  } catch (error) {
    let statusCode = 500;
    if (error.name === "ValidationError" || error.name === "MongoServerError")
      statusCode = 400;
    return res.status(statusCode).json({
      message: "Something went wrong",
      data: {},
      success: false,
      err: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // checking the required fields
    const { email, password } = req.body;
    console.log(`email: ${email}, password: ${password}`)
    if (!password || !email) {
          return res.status(400).json({
            message: "Something went wrong",
            data: {},
            success: false,
            err: "Email and Password are mandatory",
          });
    }
    // Login user
    const user = await loginUser({ email, password });

    // Set JWT token in cookie
    const token = await user.generateJWTToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User login successfully",
      user,
    });
  } catch (error) {

    let statusCode = 500;
    return res.status(statusCode).json({
      message: "Unable to login",
      data: {},
      success: false,
      err: error,
    });
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    message: "User logged out successfully",
    data: {},
    success: true,
    err: null,
  });
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        message: "User details",
        success: true,
        data: user,
        err: null
    });
  } catch (error) {
    let statusCode = 500;
    return res.status(statusCode).json({
      message: "Unable to get user details",
      data: {},
      success: false,
      err: error,
    });
  }
};

const forgotPassword = async (req, res, next) => {
  // take email from req.body
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }
  // find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email is not registered", 400));
  }
  // generate reset token
  const resetToken = await user.generatePasswordToken();
  // save reset token and expiry in db
  await user.save();
  // send email to user with reset token
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "Reset Password";
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reaseon then copy paste this link in new tab ${resetPasswordUrl}. If you have not requested this, kindly ignore`;
  // send email
  try {
    await sendEmail(email, subject, message); // nodemailer > utils/sendEmail.js
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (error) {
    // if error then remove reset token and expiry from db
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    // save user
    await user.save();
    return next(new AppError(e.message, 500));
  }
};

const resetPassword = async (req, res, next) => {
  // take reset token from req.params
  const { resetToken } = req.params;
  // take password from req.body
  const { password } = req.body;
  // check if reset token is valid and not expired
  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() }, // $gt = greater than
  });
  // if valid then update password
  if (!user) {
    return next(
      new AppError("Token is invalid or expired, please try again", 400)
    );
  }
  // save new password and remove reset token and expiry
  user.password = password;
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  // save user
  await user.save();

  req.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

const changePassword = async (req, res, next) => {
  const { id } = req.user;
  // take old password, new password from req.body
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new AppError("All fields are required", 400));
  }
  // find user by id
  const user = await User.findById(id).select("+password");
  // check if user exists
  if (!user) {
    return next(new AppError("User does not exists", 400));
  }
  // check if old password is correct
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    return next(new AppError("Old password is incorrect", 400));
  }
  // update password
  user.password = newPassword;
  // save user
  await user.save();
  // send response
  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

const updateProfile = async (req, res, next) => {
  // take name and avatar from req.body
  const { fullName } = req.body;

  // find user by id
  const { id } = req.user;
  const user = await User.findById(id);
  // check if user exists
  if (!user) {
    return next(new AppError("User does not exists", 400));
  }
  // update name and avatar
  if (fullName) {
    user.fullName = fullName;
  }
  if (req.file) {
    try {
      // delete previous avatar from cloudinary
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      // upload new avatar
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });
      // save new avatar
      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
        // * remove the file from local server
        fs.rm(`uploads/${req.file.filename}`);
      }
      await user.save();
      // send response
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      return next(
        new AppError(
          error.message || "File not uploaded, please try again",
          400
        )
      );
    }
  }
};

export {
  login,
  logout,
  getProfile,
  register,
  resetPassword,
  forgotPassword,
  changePassword,
  updateProfile,
};
