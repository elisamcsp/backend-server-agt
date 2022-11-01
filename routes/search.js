var express = require("express");

var app = express();
var Doctor = require("../models/doctor");
var Patient = require("../models/patient");
var User = require("../models/user");

// Rutas
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
    Doctor.find({}, "dni name email")
      .or([{ name: regex }, { email: regex }])
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
