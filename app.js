// Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar Rutas
var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");
var loginRoutes = require("./routes/login");
var doctorRoutes = require("./routes/doctor");
var patientRoutes = require("./routes/patient");
var searchRoutes = require("./routes/search");

// Conexion a la base de datos
mongoose.connection.openUri("mongodb://localhost:27017/agtDB", (err, res) => {
  if (err) throw err;

  console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
});

// Rutas
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);
app.use("/user", userRoutes);
app.use("/login", loginRoutes);
app.use("/", appRoutes);
app.use("/search", searchRoutes);

// Escuchar peticiones
app.listen(3000, function () {
  console.log(
    "Express server público corriendo en el puerto 3000: \x1b[32m%s\x1b[0m",
    "online"
  );
});
