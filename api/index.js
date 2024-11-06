const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const UserModel = require("./models/User");
require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGODB_URI);

app.get("/test", (req, res) => {
  res.json("test 200 ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(user);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const passOk = bcrypt.compareSync(password, user.password);
    if(passOk) {
      res.json('pass ok');
    } else {
      res.json('pass not ok');
    }
    res.json("found");
  } else {
    res.json("not found");
  }
});

app.listen(4000);
