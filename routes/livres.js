const express = require("express");
const router = express.Router();
const Livres = require("../modeles/livres");
const mongoose = require("mongoose");
const { estAuthentifie, estGestion } = require("../config/auth");

// Route get menu livres
router.get("/", estAuthentifie, (requete, res) => {
  res.render("menuLivres", { titre: "Gestion des livres", user: requete.user });
});

// Route get liste des livres
router.get("/menu", estAuthentifie, (requete, res) => {
  Livres.find({}, null, { sort: { titre: 1 } })
    .exec()
    .then((livres) => {
      res.render("livres", {
        livres: livres,
        user: requete.user,
        titre: "Liste des livres",
      });
    })
    .catch((err) => console.log(err));
});
router.get("/boutique", estAuthentifie, (requete, res) => {
  Livres.find({}, null, { sort: { titre: 1 } })
    .exec()
    .then((livres) => {
      res.render("livres", {
        livres: livres,
        user: requete.user,
        titre: "Liste des livres",
      });
    })
    .catch((err) => console.log(err));
});

// Route get modifier un livre (isbn passée en paramètre)
router.get("/editer/:isbn", estGestion, (requete, reponse) => {
  const isbn = requete.params.isbn;
  Livres.findOne({
    isbn: isbn,
  })
    .exec()
    .then((livre) => {
      reponse.render("livresEditer", {
        titre: "Modifier un livre",
        livre,
      });
    })
    .catch((err) => console.log(err));
});

// Route post modifier un livre (Réception des données du formulaire)
router.post("/editer", estGestion, (requete, reponse) => {
  const {
    titre,
    auteur,
    editeur,
    langue,
    prix,
    isbn,
    description,
    nbPage,
    image,
  } = requete.body;

  Livres.findOneAndUpdate(
    { isbn: isbn },
    {
      titre,
      auteur,
      editeur,
      langue,
      prix,
      isbn,
      description,
      nbPage,
      image,
    },
    { new: true }
  )
    .then((livre) => {
      requete.flash("success_msg", "Le livre a été modifié avec succès");
      reponse.redirect("/livres/menu");
    })
    .catch((err) => console.log(err));
});

// Route get ajouter un livre
router.get("/ajouter", estGestion, (requete, reponse) => {
  reponse.render("livresAjouter", { titre: "Ajouter un livre" });
});

// Route post ajouter un livre (Réception des données du formulaire)
router.post("/ajouter", estGestion, (requete, reponse) => {
  const {
    titre,
    auteur,
    editeur,
    langue,
    isbn,
    prix,
    description,
    nbPage,
    image,
  } = requete.body;
  let errors = [];

  if (
    !titre ||
    !auteur ||
    !editeur ||
    !langue ||
    !prix ||
    !isbn ||
    !description ||
    !nbPage ||
    !image
  ) {
    errors.push({ msg: "Veuillez remplir tout les champs" });
  } else {
    const nouveauLivre = new Livres({
      _id: new mongoose.Types.ObjectId(),
      titre,
      auteur,
      editeur,
      langue,
      isbn,
      prix,
      description,
      nbPage,
      image,
    });
    nouveauLivre
      .save()
      .then((livre) => {
        requete.flash("success_msg", "Livre ajouté a la DB");
        reponse.redirect("/livres/menu");
      })
      .catch((err) => console.log(err));
  }
});

// route pour supprimer un livre (id passé en paramètre)
router.get("/supprimer/:id", estGestion, (requete, reponse) => {
  const id = requete.params.id;
  Livres.findByIdAndDelete(id)
    .then(
      requete.flash("success_msg", "Le livre a été supprimé avec succès"),
      reponse.redirect("/livres/menu")
    )
    .catch((err) => console.log(err));
});

module.exports = router;
