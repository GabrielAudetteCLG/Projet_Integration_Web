const mongoose = require("mongoose");

// schema de donnees pour les usagers

let schemaUsagers = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  role: {
    type: Array,
    required: true,
    default: ["normal"],
  },
  fichierImage: {
    type: String,
    required: true,
    default: "",
  },
});

let Usagers = (module.exports = mongoose.model("usagers", schemaUsagers));

// Modification pull test
