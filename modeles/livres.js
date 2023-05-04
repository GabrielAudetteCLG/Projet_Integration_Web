const mongoose = require("mongoose");

let schemaLivres = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  titre: {
    type: String,
    required: false,
  },
  auteur: {
    type: String,
    required: false,
  },
  editeur: {
    type: String,
    required: false,
  },
  langue: {
    type: String,
    required: false,
  },
  isbn: {
    type: String,
    required: false,
  },
  prix: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  nbPage: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

let Livres = (module.exports = mongoose.model("livres", schemaLivres));
