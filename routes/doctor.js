var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var mdAuthentication = require("../middlewares/authentication");

var app = express();

var Doctor = require("../models/doctor");

// ==========================================
// Obtener todos los Médicos
// ==========================================
app.get("/", (req, res, next) => {
  Doctor.find({}, (err, doctor) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al cargar médicos",
        errors: err,
      });
    }

    res.status(200).json({
      ok: true,
      doctor: doctor,
    });
  });
});

// ==========================================
// Actualizar médico
// ==========================================
app.put("/:id", mdAuthentication.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Doctor.findById(id, (err, doctor) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el médico",
        errors: err,
      });
    }

    if (!doctor) {
      return res.status(400).json({
        ok: false,
        message: "El médico con el id" + id + "no existe",
        errors: {
          message: "No existe un médico con ese ID en la base de datos",
        },
      });
    }

    doctor.name = body.name;
    doctor.email = body.email;
    doctor.phone = body.phone;
    doctor.specialty = body.specialty;
    doctor.user = req.user._id;

    doctor.save((err, doctorSave) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al actualizar médico",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        doctor: doctorSave,
        userToken: req.user,
      });
    });
  });
});

// ==========================================
// Crear un nuevo médico
// ==========================================
app.post("/", mdAuthentication.verifyToken, (req, res) => {
  var body = req.body;

  var doctor = new Doctor({
    dni: body.dni,
    name: body.name,
    email: body.email,
    phone: body.phone,
    specialty: body.specialty,
    user: req.user._id,
  });

  doctor.save((err, doctorSafe) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear médico",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      doctor: doctorSafe,
      userToken: req.user,
    });
  });
});

// ==========================================
// Eliminar médico por el id
// ==========================================
app.delete("/:id", mdAuthentication.verifyToken, (req, res) => {
  var id = req.params.id;

  Doctor.findByIdAndRemove(id, (err, doctorDeleted) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar médico",
        errors: err,
      });
    }

    if (!doctorDeleted) {
      return res.status(400).json({
        ok: false,
        message: "No existe un médico con ese id",
        errors: {
          message: "No existe un médico con ese id",
        },
      });
    }

    res.status(200).json({
      ok: true,
      doctor: doctorDeleted,
    });
  });
});

module.exports = app;
