const User = require('../models/userModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncError = require('../middleware/CatchAsyncErrors')
const sendToken = require('../utils/jwt')
const jwt = require('jsonwebtoken')

// register new user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return next(new ErrorHandler('Missing fields', 400))
  }
  const exitingUser = await User.findOne({ email })
  if (exitingUser) {
    return next(new ErrorHandler('User already exist', 400))
  }
  const user = await User.create({
    name,
    email,
    password,
  })
  sendToken(user, 200, res)
})

// Login existing user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Missing fields', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  sendToken(user, 200, res);
});

// Logout current user
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  // No need to clear cookies, since we're not setting any cookies
  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});


// Send current user details
exports.sendCurrentUser = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(
      new ErrorHandler('Please login again to access this resource', 401)
    );
  }

  try {
    const decodedData = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)

    const user = await User.findById(decodedData.id);
    if (!user) {
      return next(new ErrorHandler('User not found', 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler('Invalid Token', 401));
  }
});


// send user(s)
exports.sendUsers = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {}
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
  res.status(200).json({
    success: true,
    data: users,
  })
})
