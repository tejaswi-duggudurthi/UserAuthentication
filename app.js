import express, { Router } from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const router = express.Router();
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
const bcrypt = bcryptjs;
import model from "./models/User.js";
const User = model;
import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;
const JWT_SECRET = "lsjdflkhhfhfhf;*@&*^*^#&*^T$&^$jhfjkdfkjgg";

mongoose.connect(
  "mongodb+srv://Tejaswi:<teju12>@cluster0.gtitz.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Database connection established");
  }
);
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/static/register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/static/index.html"));
});

app.use(express.static(path.join(__dirname, "/css")));
app.use("/", router);
app.use(bodyParser.json());

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();
  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    //combo is fine
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET
    );

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password: plainTextPassword } = req.body;
  if (!username || typeof username !== "string") {
    alert("Invalid username");
    return res.json({ status: "error", error: "Invalid username" });
  }
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }
  if (plainTextPassword.length < 6) {
    return res.json({
      status: "error",
      error: "Password is too small,Should be atleast 7 characters",
    });
  }
  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const response = await User.create({
      username,
      email,
      password,
    });
    console.log("User created successfully:", response);
  } catch (err) {
    console.log(err.message);
    if (err.code == 11000) {
      //11000 is error code for duplicate value
      console.log(err.message);
      return res.json({ status: "error", error: "Invalid details" });
    }
    throw error;
  }
  res.json({ status: "ok" });
});
app.listen(3000, () => {
  console.log("Server started");
});
