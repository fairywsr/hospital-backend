export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWT();
  console.log("user from controller", user, user.role);
  console.log(token, "in jwt 3");
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  console.log(token, "in jwt 8");
  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    token,
    user,
  });
};
