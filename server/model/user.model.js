import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import crypto from 'crypto'


const userSchema = new Schema({
    fullName : {
        type:String,
        required : [true, "Name is required"],
        minLength : [5, "Name must be greater than 5 characters"],
        maxLength : [50, "Name must be greater than 50 characters"],
        trim:true,
    },
    email: {
        type:String,
        required:[true, "Email is required"],
        unique:[true, "This email is already registered, Sign in instead"],
        lowercase : true,
        trim : true,
        match : [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, "Please provide a valid email address"],
    },
    password: {
        type:String,
        required : [true, "Password is required"],
        minLength : [8, "Password must be atleast 8 characters"],
        select : false,
    },
    role:{
        type:String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    avatar:{
        public_id:{
            type:String,
        },
        secure_url : {
            type:String,
        }
    },
    forgotPasswordToken : String,
    forgotPasswordExpiry : Date
}, { timestamps : true })

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    return next();
})
userSchema.methods = {
    comparePassword : async function(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generateJWTToken : function() {
        return jwt.sign(
            { id:this._id, role:this.role, email:this.email, subscrption:this.subscrption },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    },
    generatePasswordToken: async function(){
        const resetToken = crypto.randomBytes(20).toString('hex')

        this.forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')
        ;
        this.forgotPasswordExpiry = Date.now() + 15*60*1000 // 15 mins from now
        return resetToken;
    }
}

const User = model('User', userSchema)

export default User