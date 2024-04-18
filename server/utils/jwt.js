const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken()

  res.status(statusCode).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    },
  })
}

module.exports = sendToken

