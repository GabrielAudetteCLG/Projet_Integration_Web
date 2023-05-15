const mongoose = require("mongoose");

let schemaProduits = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    default: ""
  },
  prix: {
    type: String,
    required: false,
  },
  marque: {
    type: String,
    required: false,
  }  
});

let Produits = (module.exports = mongoose.model("produits", schemaProduits));
