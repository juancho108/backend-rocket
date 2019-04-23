const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  return next();
});

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  //console.log('ok');
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});

mongoose.connect(
  "mongodb+srv://juancho108:arsenal1@cluster0-rg5sh.mongodb.net/rocket?retryWrites=true",
  { useNewUrlParser: true }
);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

app.use(require("./routes"));

app.listen(process.env.PORT || 3333);
