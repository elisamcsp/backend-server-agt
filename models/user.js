var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: [true, "El nombre es necesario"] },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"],
  },
  password: { type: String, required: [true, "La contraseña es necesaria"] },
  img: { type: String, required: false },
  role: { type: String, default: "USER_ROLE" },
});

userSchema.plugin(uniqueValidator, { message: "El correo ya existe" });

module.exports = mongoose.model("User", userSchema);
