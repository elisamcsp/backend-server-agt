var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var doctorSchema = new Schema({
  dni: {
    type: String,
    unique: true,
    required: [true, "{PATH} es obligatorio"],
  },
  name: { type: String, required: [true, "{PATH} es obligatorio"] },
  email: {
    type: String,
    required: [true, "{PATH} es obligatorio"],
  },
  phone: { type: Number, required: false },
  specialty: { type: String, required: [true, "{PATH} es obligatorio"] },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

doctorSchema.plugin(uniqueValidator, { message: "El DNI ya existe" });

module.exports = mongoose.model("Doctor", doctorSchema);
