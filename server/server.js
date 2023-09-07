import app from './app.js'
import {config} from 'dotenv'
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay';
config();

const PORT = process.env.PORT || 5000

cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_secret : process.env.CLOUDINARY_API_SECRET,
    api_key : process.env.CLOUDINARY_API_KEY,
})

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

app.listen(PORT, async () => {
    console.log(`App is running at http://localhost:${PORT}`)
})