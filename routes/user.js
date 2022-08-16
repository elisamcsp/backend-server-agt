var express = require("express");

var app = express();

var User = require("../models/user");

// Rutas
app.get("/", (req, res, next) => {
  User.find({}, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuarios",
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
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuariotoken: req.usuario,
    });
  });
});

module.exports = app;

app.get("");
