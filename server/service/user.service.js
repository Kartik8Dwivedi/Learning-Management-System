import User from "../model/user.model.js";
import cloudinary from "cloudinary";
import sendEmail from "../utils/sendEmail.js";
import fs from "fs/promises";
import crypto from "crypto";

const createUser = async ({ fullName, email, password, avatarFile, path }) => {
  try {
    const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://as2.ftcdn.net/v2/jpg/05/11/55/91/1000_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg",
      },
    });

    //todo: upload user picture
    if (avatarFile) {
      try {
        const result = await cloudinary.v2.uploader.upload(path.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });
        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
          // * remove the file from local server
          fs.rm(`uploads/${path.filename}`);
        }
      } catch (error) {
        throw new Error(
          error.message || "File not uploaded, please try again",
          400
        );
      }
    }

    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({
        message: "Invalid Credentials",
        data: {},
        success: false,
        err: "Email not found or password is incorrect",
      });
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const mailResetToken = async (user, email) => {
  try {
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
      return true;
    } catch (error) {
      // if error then remove reset token and expiry from db
      user.forgotPasswordExpiry = undefined;
      user.forgotPasswordToken = undefined;
      // save user
      await user.save();
        throw new Error(
            error || "Unable to send reset password link, please try again",
            400
        );
    }
  } catch (error) {
    throw error;
  }
};

export { createUser, loginUser, mailResetToken };
