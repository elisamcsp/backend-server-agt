var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var mdAuthentication = require("../middlewares/authentication");

var app = express();

var User = require("../models/user");

// ==========================================
// Obtener todos los usuarios
// ==========================================
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
// Actualizar usuario
// ==========================================
app.post("/:id", mdAuthentication.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el usuario",
        errors: err,
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "El usuario con el id" + id + "no existe",
        errors: {
          message: "No existe un usuario con ese ID en la base de datos",
        },
      });
    }

    user.name = body.name;
    user.email = body.email;
    user.role = body.role;

    user.save((err, userSave) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al actualizar usuario",
          errors: err,
        });
      }

      userSave.password = ":)";

      res.status(200).json({
        ok: true,
        user: userSave,
      });
    });
  });
});

// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post("/", mdAuthentication.verifyToken, (req, res) => {
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
      userToken: req.user,
    });
  });
});

// ==========================================
// Eliminar usuario por el id
// ==========================================
app.delete("/:id", mdAuthentication.verifyToken, (req, res) => {
  var id = req.params.id;

  User.findByIdAndRemove(id, (err, userDeleted) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar usuario",
        errors: err,
      });
    }

    if (!userDeleted) {
      return res.status(400).json({
        ok: false,
        message: "No existe un usuario con ese id",
        errors: {
          message: "No existe un usuario con ese id",
        },
      });
    }

    res.status(200).json({
      ok: true,
      user: userDeleted,
    });
  });
});

module.exports = app;

app.get("");
