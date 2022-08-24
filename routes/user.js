var express = require("express");
var bcrypt = require("bcryptjs");

var app = express();

var User = require("../models/user");

// Rutas
app.get("/", (req, res, next) => {
  User.find({}, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al cargar usuarios",
        errors: err,
      });
    }

    res.status(200).json({
      ok: true,
      user: user,
    });
  });
});

// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post("/", (req, res) => {
  var body = req.body;

  var user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  user.save((err, userSafe) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      user: userSafe,
    });
  });
});

module.exports = app;

app.get("");
