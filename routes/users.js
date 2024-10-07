const bodyParser = require("body-parser");
const { Router } = require("express");
const userRouter = Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const { JWT_USER_SECRET } = require("../config");
const { userModel, purcahseModel, courseModel } = require("../db");
const { userAuth } = require("../middleware/userAuth");

userRouter.use(bodyParser.urlencoded({ extended: false }));

userRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //craeting credentials validator
  const signupValidator = z.object({
    username: z.string(),
    password: z.string().min(3),
  });

  try {
    signupValidator.parse({ username, password });
    // creating user account

    await bcrypt.hash(password, 3, async function (err, hash) {
      try {
        const result = await userModel.create({
          username: username,
          password: hash,
        });

        if (result) {
          //fetching user acoount  for userId
          const findUser = await userModel.findOne({ username });
          const token = jwt.sign(
            {
              _id: findUser._id,
            },
            JWT_USER_SECRET
          );

          // return token
          res.json({
            message: "User signed up!",
            token: token,
          });
        } else {
          res.josn({
            message: "Unable to update DB",
          });
        }
      } catch (err) {
        res.json({ message: "username already in use" });
        console.log(err);
      }
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Use correct format for credenial",
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const findUser = await userModel.findOne({ username });

  if (findUser) {
    await bcrypt.compare(password, findUser.password, (err, result) => {
      if (err) {
        res.json({ message: "Invalid Credentials wrngpassword" });
      }
      if (result) {
        const token = jwt.sign(
          {
            _id: findUser._id,
          },
          JWT_USER_SECRET
        );

        res.json({
          message: "User logged in",
          token: token,
        });
      }
    });
  } else {
    res.json({ message: "Invalid credentials finduser" });
  }
});

// auth middleware

// to be checked
userRouter.get("/courses", userAuth, async (req, res) => {
  try {
    const result = await courseModel.find();

    res.json({ result: result });
  } catch (e) {
    res.json({ message: "Error whilee fetching details" });
  }
});

// to be checked
userRouter.post("/courses/:courseId", async (req, res) => {
  const courseID = new mongoose.Types.ObjectId(req.params.courseID);
  const userID = req.userId;

  try {
    await purcahseModel.create({
      courseID: courseID,
      userID: userID,
    });

    res.json({
      messgae: "Purchase successful",
    });
  } catch (e) {
    res.json({ message: "Purchase failed" });
  }
});

// to be checked
userRouter.get("/purchasedCourses", async (req, res) => {
  const userId = req.UserId;
  const result = await purcahseModel.find({ userID: userId });
  if (result.length > 0) {
    res.json({ purcahsed: result });
  } else {
    res.json({ message: "No course purchased yet!" });
  }
});

module.exports = { userRouter };
