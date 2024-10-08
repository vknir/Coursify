const bodyParser = require("body-parser");
const { Router } = require("express");
const adminRouter = Router();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_ADMIN_SECRET } = require("../config");
const { adminModel } = require("../db");

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
      }
    });
  } catch (e) {
    console.log(e);
    res.josn({ message: "Invalid credentails error" });
  }
});

// auth middleware

adminRouter.post("/courses", (req, res) => {});

adminRouter.put("/courses/:courseId", (req, res) => {});

adminRouter.get("/courses", (req, res) => {});

module.exports = { adminRouter };
