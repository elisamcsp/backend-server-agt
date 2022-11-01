var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var mdAuthentication = require("../middlewares/authentication");

var fileUpload = require("express-fileupload");

var Patient = require("../models/patient");

var app = express();

app.use(
  fileUpload({
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: true,
  })
);

// Rutas
app.put("/patient/:id", mdAuthentication.verifyToken, (req, res) => {
  var id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No se ha seleccionado una imagen",
      error: { message: "Debe seleccionar una imagen" },
    });
  }

  // Obtener nombre del archivo
  var file = req.files.image;
  var nameSplited = file.name.split(".");
  var extFile = nameSplited[nameSplited.length - 1];

  // Extensiones válidas
  var validExt = ["png", "jpg", "jpeg", "gif"];
  if (validExt.indexOf(extFile) < 0) {
    return res.status(400).json({
      ok: false,
      extFile: file.name,
      mensaje: "Extensión no es válida",
      error: { message: "Las extensiones válidas son: " + validExt.join(", ") },
    });
  }

  // Generación de nombre de archivo
  var nameFile = `${id}-${new Date().getMilliseconds()}.${extFile}`;

  // Mover el archivo del temporal a un path
  var path = `uploads/patients/${id}/${nameFile}`;
  file.mv(path, function (err) {
    if (err) {
      return res.status(500).json({
        ok: false,
        path: path,
        mensaje: "Error al mover archivo",
        error: err,
      });
    }

    updatePatient(id, path, res, req);
  });
});

function updatePatient(id, path, res, req) {
  Patient.findById(id, (err, patient) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar al paciente",
        error: err,
      });
    }

    if (!patient) {
      return res.status(400).json({
        ok: true,
        mensaje: "Paciente no existe",
        errors: { message: "Paciente no existe" },
      });
    }

    patient.images.push({
      name: path,
      path: path,
    });

    patient.user = req.user._id;

    patient.save((err, patientSave) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al crear la imagen",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        patient: patientSave,
      });
    });
  });
}

module.exports = app;
