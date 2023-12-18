
import JWT from 'jsonwebtoken'

const isLoggedIn = (req, res, next) => {
  // verify token
  const token = (req.cookies && req.cookies.token) || null;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Not authorized",
    });
  }
  // inject user information in req
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

export const authorizedRoles = (...roles) => (req,res,next) => {
  const currentRole = req.user.role;
  if(!roles.includes(currentRole)) {
    return next(new AppError("You are not authorized to perform this action", 403));
  }
  next();
};

export const authorizedSubscriber = (req,res,next) => {
  const subscriptionStatus = req.user.subscription.status;
  const currentRole = req.user.role;
  if(currentRole === 'ADMIN'&& subscriptionStatus !== 'active') {
    return next(new AppError("You are not authorized to perform this action", 403));
  }
  next();
};

export default isLoggedIn
