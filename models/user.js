var mongoose = require("mongoose");

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

module.exports = mongoose.model("User", userSchema);
