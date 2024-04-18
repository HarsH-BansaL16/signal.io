const catchAsyncErrors = require('./CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.checkUserAuthentication = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.authorization

  try {
    const decodedData = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
    const user = await User.findById(decodedData.id)

    if (!user) {
      return next(new ErrorHandler('User not found', 401))
    }
    
    req.user = user
    next()
  } catch (error) {
    return next(new ErrorHandler('Unauthorized', 401))
  }
});
