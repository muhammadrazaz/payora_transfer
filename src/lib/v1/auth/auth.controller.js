const httpStatus = require('http-status');
const rn = require('random-number');
const { OAuth2Client } = require('google-auth-library');
const catchAsync = require('../../../utils/catchAsync');
const ApiError = require('../../../utils/ApiError');
const { authService, tokenService, emailService, userService } = require('../../../services');
const { responseHandler } = require('../../../utils/response');
const { User } = require('../../../models');
const bcrypt = require('bcryptjs');

const createUser = catchAsync(async (req, res) => {
  var user = await User.findOne({ email: req.body.email });
  if (user) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User already exists');
  }

  if (!user) {
    const userEntry = {
      firstNamename: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: 'customer',
      isEmailVerified: true,
    };

    if (req.body.password) {
      userEntry.password = await bcrypt.hash(req.body.password, 8);
    }

    user = await User.create(userEntry);
  }
  const tokens = await tokenService.generateAuthTokens(user);
  responseHandler(res, { user, tokens }, 'User created successfully', httpStatus.OK);
});

const login = catchAsync(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password, role);
  if (!user) {
    responseHandler(res,'Forbidden', httpStatus.FORBIDDEN);
  }

  if (user.status != 'ACTIVE') {
    responseHandler(res,  'User is restricted', httpStatus.FORBIDDEN);
  }
  
  const tokens = await tokenService.generateAuthTokens(user);
  responseHandler(res, { user, tokens }, 'User logged in successfully', httpStatus.OK);
});

const logout = catchAsync(async (req, res) => {
  responseHandler(res, 'User logged out successfully', httpStatus.OK);
});

const checkToken = catchAsync(async (req, res) => {

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (user) {
    responseHandler(res,  'Token is valid', httpStatus.OK);
  }
  else {
    responseHandler(res, 'Token expired', httpStatus.FORBIDDEN);
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  const code = rn({ min: 1000, max: 9999, integer: true });
  const user = await userService.getUserByEmail(req.body.email, req.body.role);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.status != 'ACTIVE') {
    responseHandler(res,  'Forbidden', httpStatus.FORBIDDEN);
  }
  await userService.updateUserById(user._id, { verificationCode: code });

  await emailService.sendForgotPasswordEmail({
    name: user.name,
    email: req.body.email,
    code: code
  });

  responseHandler(res,  'Password reset email sent successfully', httpStatus.NO_CONTENT);
});

const resetPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email, req.body.role);
  if (!user) {
    responseHandler(res,  'Forbidden', httpStatus.FORBIDDEN);
  }
  if (user.status != 'ACTIVE') {
    responseHandler(res,  'Forbidden', httpStatus.FORBIDDEN);
  }
 

  await authService.resetPassword(req.body.email, req.body.password, req.body.role);
  responseHandler(res,  'Password reset successfully', httpStatus.OK);
});

const verifyCode = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email, req.body.role);
  if (!user) {
    responseHandler(res,  'Forbidden', httpStatus.FORBIDDEN);
  }
  if (user.status != 'ACTIVE') {
    responseHandler(res,  'Forbidden', httpStatus.FORBIDDEN);
  }
  
  if (user.verificationCode !== req.body.code) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect code');
  }

  responseHandler(res,  'Code verified successfully', httpStatus.OK);
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignup = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log('Token Audience:', payload.aud);
    console.log('Token Issuer:', payload.iss);

    const email = payload.email;
    const firstName = payload.given_name;
    const lastName = payload.family_name;
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (user) {
      return responseHandler(res,  'User already exists', httpStatus.NOT_ACCEPTABLE);
    }

    user = new User({
      email,
      firstName,
      lastName,
      googleId,
      password: null,
      role: 'customer'
    });

    await user.save();
    const tokens = await tokenService.generateAuthTokens(user);
    responseHandler(res, {user,tokens}, 'Google Signup success', httpStatus.OK);
  } catch (error) {
    console.error('Error during Google signup:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Google signup failed');
  }
});

const googleSignin = catchAsync(async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log('Token Audience:', payload.aud);
    console.log('Token Issuer:', payload.iss);

    const email = payload.email;
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (!user) {
      return responseHandler(res,  'User not found. Please sign up first.', httpStatus.NOT_FOUND);
    }

    if (user.status !== 'ACTIVE') {
      return responseHandler(res, 'User is restricted', httpStatus.FORBIDDEN);
    }

    const tokens = await tokenService.generateAuthTokens(user);

    responseHandler(res, { user, tokens }, 'User signed in successfully', httpStatus.OK);
  } catch (error) {
    console.error('Error during Google signin:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Google signin failed');
  }
});


module.exports = {
  createUser,
  login,
  logout,
  checkToken,
  forgotPassword,
  resetPassword,
  verifyCode,
  googleSignup,
  googleSignin
};
