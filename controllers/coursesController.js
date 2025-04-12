const Course = require("../models/coursesModel");

const httpStatusText = require("../utils/httpStatusText");

const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res, next) => {
  const courses = await Course.find({}, { __v: false });
  return res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create(
      404,
      "course was not found",
      httpStatusText.FAIL
    );
    return next(error);
  }
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { course } });
});

const addNewCourse = asyncWrapper(async (req, res, next) => {
  const newCourse = new Course(req.body);
  await newCourse.save();

  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { newCourse } });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const updatedCourse = await Course.findByIdAndUpdate(courseId, {
    $set: { ...req.body },
  });

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  console.log(req.currentUser);
  await Course.deleteOne({ _id: req.params.courseId });
  return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  addNewCourse,
  updateCourse,
  deleteCourse,
};
