import Razorpay from "razorpay";
import User from "../model/user.model.js";
import AppError from "../utils/appError.js";
import Payment from "../model/payment.model.js";

export const getRazorpayApiKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Razorpay API Key fetched successfully",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    new AppError(error.message, 500);
  }
};

export const buySubscription = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login", 500));
    }

    if (user.role === "ADMIN") {
      return next(
        new AppError("Unauthorized, admin cannot buy subscription", 400)
      );
    }

    const subscription = await Razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
    });

    // update user model with subscrition
    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Subscription purchased successfully",
      subscription,
    });
  } catch (error) {
    new AppError(error.message, 500);
  }
};

export const verifySubscription = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login", 500));
    }

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_payment_id + "|" + razorpay_subscription_id);

    if (generated_signature != razorpay_signature) {
      return next(new AppError("Payment not verified, please try again", 500));
    }

    // Record payment in database
    await Payment.create({
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    });

    // Update user model with payment/subscription details
    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    new AppError(error.message, 500);
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login", 500));
    }

    if(user.role === 'ADMIN'){
        return next(new AppError("Unauthorized, admin cannot cancel subscription", 403));
    }

    const subscriptionId = user.subscription.id;

    const subscription = await Razorpay.subscriptions.cancel(
        subscriptionId
    )

    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully",
        subscription
    })

  } catch (error) {
    new AppError(error.message, 500);
  }
};

export const getAllPayments = async (req, res) => {
  try {
  } catch (error) {
    new AppError(error.message, 500);
  }
};
