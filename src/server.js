const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

var whitelist = ["http://localhost:3000"];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No Permitido por CORS"));
    }
  }
};

app.use(cors(corsOptions));

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
