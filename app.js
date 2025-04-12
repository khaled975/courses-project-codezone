///////// LEC 6 PART 1 /////////////////////

// const { MongoClient } = require("mongodb");

// const url =
//   "mongodb+srv://khaledbebo975:012265@cluster0.6tpmh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const client = new MongoClient(url);

// async function main() {
//   await client.connect();
//   console.log("Client connected successfully");

//   const db = client.db("codezone");

//   const collection = db.collection("courses");

//   const data = await collection.find().toArray();

//   console.log(data);
// }

// main();

///////// LEC 6 PART 2 /////////////////////
// DOTENV
require("dotenv").config();

// httpStatusText
const httpStatusText = require("./utils/httpStatusText");

// MONGOOSE
const mongoose = require("mongoose");

const url = process.env.MONGO_DB_URL;

mongoose.connect(url).then(() => {
  console.log("mongodb server started");
});

// EXPRESS
const express = require("express");
const app = express();
app.use(express.json());

// CORS
const cors = require("cors");
app.use(cors());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ROUTER
const coursesRouter = require("./routes/coursesRoutes");
const usersRouter = require("./routes/usersRoutes");
app.use("/courses", coursesRouter);
app.use("/users", usersRouter);

//  GLOBAL MIDDLEWARE FOR NOT FOUND ROUTES
app.all("*", (req, res) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "this route is not available",
    code: 404,
  });
});

// GLOBAL MIDDLEWARE FOR ERROR HANDLER
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    status: error.statusCode || 500,
    statusText: error.statusText || httpStatusText.ERROR,
    message: error.message || "unknown error",
    data: null,
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});
