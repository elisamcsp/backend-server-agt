var express = require("express");

const path = require("path");
const fs = require("fs");
var app = express();

// Rutas
app.get("/:id/:img", (req, res, next) => {
  var id = req.params.id;
  var img = req.params.img;

  var pathImage = path.resolve(__dirname, `../uploads/patients/${id}/${img}`);

  if (fs.existsSync(pathImage)) {
    res.sendFile(pathImage);
  } else {
    var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
    res.sendFile(pathNoImage);
  }
});

module.exports = app;
