// create jwt token and save as a cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken()
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.REACT_APP_NODE_ENV === 'production',
    sameSite: 'None',
    domain: '.signal-io.onrender.com', 
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
}

module.exports = sendToken
