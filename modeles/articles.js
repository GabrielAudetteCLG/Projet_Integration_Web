const mongoose = require("mongoose");

let schemaArticles = mongoose.Schema({
 
  nom: {
    type: String,
    required: false,
  },
  imageFond: {
    type: String,
    required: true,
    default: "images/2080_ti.jpg",
  },
  marque: {
    type: String,
    required: false,
  },
  prix: {
    type: Number,
    required: false,
  },
  details: {
    type: String,
    required: false,
  }
});

let Articles = (module.exports = mongoose.model("articles", schemaArticles));
