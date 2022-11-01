var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var validRol = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol permitido",
};

var userSchema = new Schema({
  name: { type: String, required: [true, "{PATH} es obligatorio"] },
  email: {
    type: String,
    unique: true,
    required: [true, "{PATH} es obligatorio"],
  },
  password: { type: String, required: [true, "{PATH} es obligatorio"] },
  img: { type: String, required: false },
  role: { type: String, default: "USER_ROLE", enum: validRol },
});

userSchema.plugin(uniqueValidator, { message: "El correo ya existe" });

module.exports = mongoose.model("User", userSchema);
