const express = require("express");
const router = express.Router();
const Articles = require("../modeles/articles");
const mongoose = require("mongoose");
const { estAuthentifie, estGestion } = require("../config/auth");

// Route pour afficher la liste des articles
router.get("/", estAuthentifie, (req, res) => {
  res.render("menuArticles", { titre: "Gestion des articles", user: req.user });
});

// Route pour afficher la liste des articles

router.get("/menu", estAuthentifie, (requete, res) => {
    Articles.find({}, null, { sort: { nom: 1 } })
      .exec()
      .then((articles) => {
        res.render("articles", {
            articles: articles,
          user: requete.user,
          titre: "Liste des articles",
        });
      })
      .catch((err) => console.log(err));
  });




module.exports = router;