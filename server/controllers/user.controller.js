import User from "../model/user.model.js";
import AppError from "../utils/appError.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

const cookieOptions = {
    maxAge: 7*24*60*60*1000, //* 7 days
    httpOnly: true
}

const register = async (req,res, next) => {
    const { fullName, email,password } = req.body

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

    //todo: upload user picture
    console.log('File Details >', JSON.stringify(req.file))
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
                // fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next(new AppError(error.message || 'File not uploaded, please try again', 400))
        }
    }

    await user.save()

    //todo: set JWT token in cookie

    user.password = undefined

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

export { login, logout, getProfile, register };
