
import JWT from 'jsonwebtoken'

const isLoggedIn = (req, res, next) => {
  // verify token
  const token = (req.cookies && req.cookies.token) || null;
  console.log(token)

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

export default isLoggedIn
