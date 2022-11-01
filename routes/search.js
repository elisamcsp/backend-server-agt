var express = require("express");

var app = express();
var Doctor = require("../models/doctor");
var Patient = require("../models/patient");
var User = require("../models/user");

// ===============================
// Búsquedas por colección
// ===============================
app.get("/collection/:table/:search", (req, res, next) => {
  var search = req.params.search;
  var table = req.params.table;

  var regex = new RegExp(search, "i");
  var promess;

  switch (table) {
    case "doctor":
      promess = searchDoctor(search, regex);
      break;

    case "patient":
      promess = searchPatient(search, regex);
      break;

    case "user":
      promess = searchUser(search, regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        message: "Los tipos de búsqueda sólo son : usuario, paciente y médico ",
        error: { message: "Tipo de tabla/colección no válido" },
      });
  }

  promess.then((data) => {
    return res.status(200).json({
      ok: true,
      [table]: data,
    });
  });
});

// ===============================
// Búsquedas general
// ===============================
app.get("/todo/:search", (req, res, next) => {
  var search = req.params.search;

  var regex = new RegExp(search, "i");

  Promise.all([
    searchDoctor(search, regex),
    searchPatient(search, regex),
    searchUser(search, regex),
  ]).then((answer) => {
    res.status(200).json({
      ok: true,
      doctors: answer[0],
      patients: answer[1],
      users: answer[2],
    });
  });
});

function searchDoctor(search, regex) {
  return new Promise((resolve, reject) => {
    Doctor.find({ name: regex }, "dni name email")
      .populate("user", "name email")
      .exec((err, doctors) => {
        if (err) {
          reject("Error al cargar doctores", err);
        } else {
          resolve(doctors);
        }
      });
  });
}

function searchPatient(search, regex) {
  return new Promise((resolve, reject) => {
    Patient.find({}, "dni name address birthday phone dischargeDate parentName")
      .populate("user", "name email")
      .populate("doctor", "name")
      .or([{ name: regex }, { parentName: regex }])
      .exec((err, patients) => {
        if (err) {
          reject("Error al cargar pacientes", err);
        } else {
          resolve(patients);
        }
      });
  });
}

function searchUser(search, regex) {
  return new Promise((resolve, reject) => {
    User.find({}, "name email")
      .or([{ name: regex }, { email: regex }])
      .exec((err, users) => {
        if (err) {
          reject("Error al cargar usuarios", err);
        } else {
          resolve(users);
        }
      });
  });
}

module.exports = app;
