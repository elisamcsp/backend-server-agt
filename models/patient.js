var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var patientSchema = new Schema({
  dni: {
    type: String,
    unique: true,
    required: [true, "{PATH} es obligatorio"],
  },
  name: { type: String, required: [true, "{PATH} es obligatorio"] },
  address: {
    type: String,
    required: [true, "{PATH} es obligatorio"],
  },
  birthday: {
    type: Date,
    required: [true, "{PATH} es obligatorio"],
  },
  child: { type: Boolean },
  parentName: { type: String },
  phone: { type: Number, required: false },
  dischargeDate: { type: Date, required: [true, "{PATH} es obligatorio"] },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

patientSchema.plugin(uniqueValidator, {
  message: "El DNI/NIE/Pasaporte ya existe",
});

module.exports = mongoose.model("Patient", patientSchema);
