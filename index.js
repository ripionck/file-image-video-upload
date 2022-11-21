const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 3001;

//db connection
const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/userTestDB");
    console.log("DB connected.");
  } catch (error) {
    console.log("DB not connect.");
    console.log(error);
    process.exit(1);
  }
};

//creating schema and model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required."],
  },
  image: {
    type: String,
    required: [true, "User image is required."],
  },
});

//connect model
const User = mongoose.model("User", userSchema);

//file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

//morgan middleware
app.use(morgan("dev"));

//get
app.get("/register", (req, res) => {
  res.status(200).sendFile(__dirname + "/index.html");
});

//post
//upload.single("image")
app.post("/register", upload.single("image"), async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      image: req.file.filename,
    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("API testing");
});

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await dbConnect();
});
