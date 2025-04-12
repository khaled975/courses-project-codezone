const coursesControllers = require("../controllers/coursesController");

const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const router = express.Router();

// GET ALL COURSES
router.get("/", coursesControllers.getAllCourses);

// GET COURSE BY ID
router.get("/:courseId", coursesControllers.getSingleCourse);

// ADD NEW COURSE
router.post(
  "/",
  verifyToken,
  allowedTo("MANAGER"),
  coursesControllers.addNewCourse
);

// UPDATE SINGLE COURSE
router.patch(
  "/:courseId",
  verifyToken,
  allowedTo("ADMIN", "MANAGER"),
  coursesControllers.updateCourse
);

// DELETE SINGLE COURSE
router.delete(
  "/:courseId",
  verifyToken,
  allowedTo("ADMIN", "MANAGER"),
  coursesControllers.deleteCourse
);

module.exports = router;
