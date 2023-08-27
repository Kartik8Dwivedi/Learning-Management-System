import User from "../model/user.model.js";
import AppError from "../utils/appError.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'

const cookieOptions = {
    maxAge: 7*24*60*60*1000, //* 7 days
    httpOnly: true
}

const register = async (req,res, next) => {
    console.log(req.body)
    const { fullName,email,password } = req.body

    if(!fullName || !password || !email){
        return next(new AppError('All fields are required', 400))
    }

    const userExists = await User.findOne({email})

    if(userExists){
        return next(new AppError('Email already exists', 400))
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id: email, 
            secure_url: 'https://as2.ftcdn.net/v2/jpg/05/11/55/91/1000_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg'
        }
    })
    
    if(!user){
        return next(new AppError('User registeration failed, please try again', 400))
    }
    console.log(user.file)

    //todo: upload user picture
    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
                width: 250,
                height: 250,
                gravity: "faces",
                crop: 'fill'
            });
            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                // * remove the file from local server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next(new AppError(error.message || 'File not uploaded, please try again', 400))
        }
    }

    await user.save()

    //todo: set JWT token in cookie

    const token = await user.generateJWTToken()
    user.password = undefined
    res.cookie('token', token, cookieOptions)

    res.status(200).json({
        success : true,
        message : 'User registerd successfully',
        user
    })
};

const login = async (req,res,next) => {
    const { email,password } = req.body
    if(!email || !password){
        return next(new AppError('All fields are required', 400))
    }

    const user = await User.findOne({
        email
    }).select('+password')

    if(!user || !user.comparePassword(password)){  //todo
        return next(new AppError('Email or password do not match', 400))
    }

    const token = await user.generateJWTToken()
    user.password = undefined
    res.cookie('token', token, cookieOptions) 

    res.status(201).json({
        success : true,
        message: 'User login successfully',
        user
    })
};

const logout = (req,res) => {
    res.cookie('token', null, {
        secure:true,
        maxAge:0,
        httpOnly:true
    })
    res.status(200).json({
        success: true, 
        message:"User logged out successfully"
    })
};

const getProfile = (req, res) => {
    try {
          const user = User.findById(req.user.id);

          res.status(200).json({
            success: true,
            message: "User details",
            user,
          });
    } catch (error) {
        return new AppError(error,400)
    }
};

const forgotPassword = async (req,res,next) => {
    const { email } = req.body;
    if(!email){
        return next(
            new AppError('Email is required', 400)
        )
    }
    const user = await User.findOne({email})
    if(!user){
        return next(
            new AppError('Email is not registered', 400)
        )
    }
    const resetToken = await user.generatePasswordToken();

    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reaseon then copy paste this link in new tab ${resetPasswordUrl}. If you have not requested this, kindly ignore`;
    try {
        await sendEmail(email,subject,message) // nodemailer > utils/sendEmail.js
        res.status(200).json({
            success:true,
            message:`Reset password token has been sent to ${email} successfully`
        })
    } catch (error) {
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        await user.save()
        return next(new AppError(e.message,500))
    }
}

const resetPassword = async (req,res,next) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    
    const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()} // $gt = greater than
    })
    if(!user){
        return next(new AppError('Token is invalid or expired, please try again', 400))
    }

    user.password = password;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    await user.save()

    req.status(200).json({ 
        success: true,
        message: 'Password changed successfully'
    })
}

export { login, logout, getProfile, register, resetPassword, forgotPassword };
