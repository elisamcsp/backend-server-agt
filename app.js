// Requires
var express = require("express");
var mongoose = require("mongoose");

// Inicializar variables
var app = express();

// Importar Rutas
var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");

// Conexion a la base de datos
mongoose.connection.openUri("mongodb://localhost:27017/agtDB", (err, res) => {
  if (err) throw err;

  console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
});

// Rutas
app.use("/user", userRoutes);
app.use("/", appRoutes);

// Escuchar peticiones
app.listen(3000, function () {
  console.log(
    "Express server público corriendo en el puerto 3000: \x1b[32m%s\x1b[0m",
    "online"
  );
});
