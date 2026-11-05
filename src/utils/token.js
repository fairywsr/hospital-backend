export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWT();
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  console.log(" in token.js line 7", token);
  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    token,
    user,
  });
};
