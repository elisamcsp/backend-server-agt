var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var mdAuthentication = require("../middlewares/authentication");

var app = express();

var Patient = require("../models/patient");

// ==========================================
// Obtener todos los Pacientes
// ==========================================
app.get("/", (req, res, next) => {
  var from = req.query.from || 0;

  from = Number(from);

  Patient.find({})
    .skip(from)
    .limit(3)
    .populate("user", "name email")
    .populate("doctor", "name")
    .exec((err, patient) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al cargar los pacientes",
          errors: err,
        });
      }

      Patient.count({}, (err, count) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            ok: false,
            mensaje: "Error al cargar los pacientes",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          total: count,
          patient: patient,
        });
      });
    });
});

// ==========================================
// Actualizar paciente
// ==========================================
app.put("/:id", mdAuthentication.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Patient.findById(id, (err, patient) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el paciente",
        errors: err,
      });
    }

    if (!patient) {
      return res.status(400).json({
        ok: false,
        message: "El paciente con el id" + id + "no existe",
        errors: {
          message: "No existe paciente con ese ID en la base de datos",
        },
      });
    }

    if (body.name != null) patient.name = body.name;
    if (body.address != null) patient.address = body.address;
    if (body.phone != null) patient.phone = body.phone;
    if (body.birthday != null) patient.birthday = body.birthday;
    if (body.child != null) patient.child = body.child;
    if (body.parentName != null) patient.parentName = body.parentName;
    if (body.doctor != null) patient.doctor = body.doctor;
    patient.user = req.user._id;

    patient.save((err, patientSave) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al actualizar paciente",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        patient: patientSave,
        userToken: req.user,
      });
    });
  });
});

// ==========================================
// Crear un nuevo paciente
// ==========================================
app.post("/", mdAuthentication.verifyToken, (req, res) => {
  var body = req.body;

  var patient = new Patient({
    dni: body.dni,
    name: body.name,
    address: body.address,
    phone: body.phone,
    birthday: body.birthday,
    child: body.child,
    parentName: body.parentName,
    dischargeDate: body.dischargeDate,
    doctor: body.doctor,
    user: req.user._id,
  });

  patient.save((err, patientSafe) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear médico",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      patient: patientSafe,
      userToken: req.user,
    });
  });
});

// ==========================================
// Eliminar paciente por el id
// ==========================================
app.delete("/:id", mdAuthentication.verifyToken, (req, res) => {
  var id = req.params.id;

  Patient.findByIdAndRemove(id, (err, patientDeleted) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar paciente",
        errors: err,
      });
    }

    if (!patientDeleted) {
      return res.status(400).json({
        ok: false,
        message: "No existe ningún paciente con ese id",
        errors: {
          message: "No existe ningún paciente con ese id",
        },
      });
    }

    res.status(200).json({
      ok: true,
      patient: patientDeleted,
    });
  });
});

module.exports = app;
