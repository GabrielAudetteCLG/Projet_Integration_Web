const express = require("express");
const router = express.Router();
const Articles = require("../modeles/articles");
const mongoose = require("mongoose");
const { estAuthentifie, estVendeur } = require("../config/auth");

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



  // Route get modifier un article

// Route pour afficher le formulaire de modification d'un article (ID passé en paramètre)
router.get("/editer/:id", estVendeur, (req, res) => {
  const id = req.params.id;
  Articles.findOne({
    _id: id,
  })
    .exec()
    .then((article) => {
      res.render("articlesEditer", {
        titre: "Modifier un article",
        article,
      });
    })
    .catch((err) => console.log(err));
});

  
// Route pour traiter la soumission du formulaire de modification d'un article
router.post("/editer", estVendeur, (req, res) => {
  const {
    nom,
    imageFond,
    marque,
    prix,
    details,
  } = req.body;

  Articles.findOneAndUpdate(
    { nom: nom },
    {
      nom,
      imageFond,
      marque,
      prix,
      details,
    },
    { new: true }
  )
    .then((article) => {
      req.flash("success_msg", "L'article a été modifié avec succès");
      res.redirect("/articles/menu");
    })
    .catch((err) => console.log(err));
});



// Route pour afficher le formulaire d'ajout d'un article
router.get("/ajouter", estVendeur, (req, res) => {
  res.render("articlesAjouter", { titre: "Ajouter un article" });
});

// Route pour traiter la soumission du formulaire d'ajout d'un article
router.post("/ajouter", estVendeur, (req, res) => {
  const {
    nom,
    imageFond,
    marque,
    prix,
    details,
  } = req.body;
  let errors = [];

  if (
    !nom ||
    !imageFond ||
    !marque ||
    !prix ||
    !details
  ) {
    errors.push({ msg: "Veuillez remplir tous les champs" });
  } else {
    const nouvelArticle = new Articles({
      _id: new mongoose.Types.ObjectId(),
      nom,
      imageFond,
      marque,
      prix,
      details,
    });
    nouvelArticle
      .save()
      .then((article) => {
        req.flash("success_msg", "Article ajouté à la base de données");
        res.redirect("/articles/menu");
      })
      .catch((err) => console.log(err));
  }
});

// Route pour supprimer un article (ID passé en paramètre)
router.get("/supprimer/:id", estVendeur, (req, res) => {
  const id = req.params.id;
  Articles.findByIdAndDelete(id)
    .then(() => {
      req.flash("success_msg", "L'article a été supprimé avec succès");
      res.redirect("/articles/menu");
    })
    .catch((err) => console.log(err));
});



module.exports = router;