const bodyParser = require("body-parser");
const { Router } = require("express");
const adminRouter = Router();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const { JWT_ADMIN_SECRET } = require("../config");
const { adminModel, courseModel } = require("../db");
const { adminAuth } = require("../middleware/adminAuth");

adminRouter.use(bodyParser.urlencoded({ extended: false }));

adminRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //credentials validator

  const credentialsValidator = z.object({
    username: z.string(),
    password: z.string().min(1),
  });

  try {
    credentialsValidator.parse({
      username: username,
      password: password,
    });

    await bcrypt.hash(password, 3, async (err, hash) => {
      if (err) {
        res.json({ message: "Error while hshing password" });
      }
      if (hash) {
        await adminModel.create({
          username: username,
          password: hash,
        });

        const findAdmin = await adminModel.findOne({ username: username });
        const token = jwt.sign({ _id: findAdmin._id }, JWT_ADMIN_SECRET);

        res.json({
          message: "Sign up successful",
          token: token,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({ message: "Credentails dosen't have correct format" });
  }
});

adminRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await adminModel.findOne({ username });

    await bcrypt.compare(password, result.password, (err, compareResult) => {
      if (err) {
        console.log(err);
        res.json({
          message: "Invalid credentails bcrypt",
        });
      }
      if (compareResult) {
        const token = jwt.sign({ _id: result._id }, JWT_ADMIN_SECRET);
        res.json({
          message: "Admin login successful",
          token: token,
        });
      } else {
        res.json({ message: "Invalid credential fasle result" });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({ message: "Invalid credentails error" });
  }
});

// auth middleware

adminRouter.post("/courses", adminAuth, async (req, res) => {
  const { title, description, price, imageURL, published } = req.body;
  const adminId = new mongoose.Types.ObjectId(req.adminId);

  const newCourse = {
    title: title,
    description: description,
    price: Number(price),
    imageURL: imageURL,
    published: published === "true",
    adminId: adminId,
  };
  //craeting course validator

  const courseValidator = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    imageURL: z.string(),
    published: z.boolean(),
  });

  try {
    courseValidator.parse(newCourse);

    const newCourseAdded = await courseModel.create(newCourse);
    if (newCourseAdded) {
      res.json({ message: "Successfully added a new course" });
    } else {
      res.json({ message: "Error while updaing DB" });
    }
  } catch (e) {
    console.log(e);
    res.json({ message: "Invalid data type error" });
  }
});

adminRouter.put("/courses/:courseId", adminAuth, async (req, res) => {
  const courseId = new mongoose.Types.ObjectId(req.params.courseId);
  const adminId = new mongoose.Types.ObjectId(req.adminId);

  const { title, description, price, imageURL, published } = req.body;

  const courseValidator = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    imageURL: z.string(),
    published: z.boolean(),
  });

  const updatedCourse = {
    title: title,
    description: description,
    price: Number(price),
    imageURL: imageURL,
    published: published === "true",
    adminId: adminId,
  };

  try {
    courseValidator.parse(updatedCourse);

    const isCourseUpdated = await courseModel.findByIdAndUpdate(
      courseId,
      updatedCourse
    );

    if (isCourseUpdated) {
      res.json({ message: "Successfully updated course" });
    } else {
      res.json({ message: "Failed to update DB else" });
    }
  } catch (e) {
    console.log(e);
    res.json({ message: "Wrong format error" });
  }
});

adminRouter.get("/courses", adminAuth, async (req, res) => {
  const adminId = new mongoose.Types.ObjectId(req.adminId);

  try {
    const allCourses = await courseModel.find({ adminId: adminId }).exec();
    res.json({ allCourses: allCourses });
  } catch (e) {
    res.json({ message: "Cannot fetch from db" });
  }
});

module.exports = { adminRouter };
