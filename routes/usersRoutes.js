const usersControllers = require("../controllers/usersController");
const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const multer = require("multer");
const appError = require("../utils/appError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // console.log(fileName);
    const imageType = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}-profile.${imageType}`;
    cb(null, fileName);
  },
});
const fileFilter = function (req, file, cb) {
  const imageType = file.mimetype.split("/")[0];
  if (imageType !== "image") {
    const error = appError.create(400, "the file must to be an image");
    return cb(error, false);
  }
  return cb(null, true);
};
const uploads = multer({ storage: storage, fileFilter });

// GET ALL USERS
router.get("/", verifyToken, usersControllers.getAllUsers);

// REGISTER
router.post(
  "/register",
  uploads.single("avatar"),
  usersControllers.registerUser
);

// LOGIN
router.post("/login", usersControllers.loginUser);

module.exports = router;
