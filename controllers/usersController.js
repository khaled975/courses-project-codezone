const User = require("../models/usersModel");

const httpStatusText = require("../utils/httpStatusText");

const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

// BCRYPT FOR HASHING PASSWORDS
const bcrypt = require("bcryptjs");

// GENERATE TOKEN
const generateToken = require("../utils/generateToken");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find({}, { __v: false, password: false });
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { users } });
});

const registerUser = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role, avatar } = req.body;
  console.log(req.file);

  // CHECK FOR DUPLICATED USER
  const duplicatedUser = await User.findOne({ email });
  if (duplicatedUser) {
    const error = appError.create(
      400,
      "email address is already exists",
      httpStatusText.FAIL
    );
    return next(error);
  }

  //   HASHING PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  //   GENERATING TOKEN BEFORE SAVE USER IN DB
  const token = await generateToken({
    email: user.email,
    id: user._id,
    role: user.role,
  });
  user.token = token;

  await user.save();
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user } });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  //   CHECK IF USER INSERTS EMAIL AND PASSWORD
  if (!email || !password) {
    const error = appError.create(
      400,
      "all fields are required!",
      httpStatusText.FAIL
    );
    return next(error);
  }

  //  CHECK IF USER WITH PROVIDED EMAIL ADDRESS IS EXISTS!
  const user = await User.findOne({ email });
  if (!user) {
    const error = appError.create(
      400,
      "User does not exists",
      httpStatusText.FAIL
    );
    return next(error);
  }

  //   COMPARE INSERTED PASSWORD WITH >> THE HASHED PASSWORD IN THE DB
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    const error = appError.create(
      400,
      "email or password are incorrect",
      httpStatusText.FAIL
    );
    return next(error);
  }
  //   EVERY THING IS OKAY
  const token = await generateToken({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { token },
  });
});

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
};
