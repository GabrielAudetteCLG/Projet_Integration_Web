const express = require("express");
const nodeJSpath = require("path");
const fs = require("fs");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const Usagers = require("../modeles/usagers");
const mongoose = require("mongoose");
const { estAuthentifie, estAdmin } = require("../config/auth");

// Route get menu usagers
router.get("/", estAuthentifie,  (requete, reponse) => {
  reponse.render("usagers", {
    titre: "Menu de gestion des usagers",
    user: requete.user,
  });
});

// Route si on se connecte, redirect vers menu (option gestion usagers / gestion livres)
router.post("/login", (req, rep, next) => {
  passport.authenticate("local", {
    successRedirect: "../boutique",
    failureRedirect: "/",
    failureFlash: true,
  })(req, rep, next);
});

// Route get liste des usagers
router.get("/menu", estAuthentifie, estAdmin, (requete, reponse) => {
  console.log(requete.user);
  Usagers.find({}, null, { sort: { login: 1 } })
    .exec()
    .then((usagers) =>
      reponse.render("listeUsagers", {
        titre: "Liste des usagers",
        usagers,
        user: requete.user,
      })
    )
    .catch((err) => console.log(err));
});

// Route pour Ajouter un usager (render la page avec le formulaire)
router.get("/ajouter", estAdmin, (requete, reponse) =>
  reponse.render("ajouter", { titre: "Ajout d'un usagers" })
);

// Route pour Ajouter un usager (réception des données du formulaire)
router.post("/ajouter", estAdmin, (requete, reponse) => {
  const { nom, login, password, password2, admin, vendeur } = requete.body;
  console.log(requete.body);
  let errors = [];
  let roles = ["client"];
  if (admin === "on") roles.push("admin");
  if (vendeur === "on") roles.push("vendeur");

  if (!nom || !login || !password || !password2) {
    errors.push({ msg: "Remplir toutes les cases du formulaire" });
  }
  if (password !== password2) {
    errors.push({ msg: "Les mots de passe ne correspondent pas" });
  }
  if (password.length < 4) {
    errors.push({ msg: "Le mot de passe doit avoir au moins 4 caractères" });
  }
  if (errors.length > 0) {
    reponse.render("ajouter", {
      errors,
      titre: "Ajout d'un usager",
      nom,
      login,
      password,
      password2,
      admin,
      vendeur,
    });
  } else {
    Usagers.findOne({ login: login }).then((user) => {
      if (user) {
        errors.push({ msg: "Ce courriel existe déjà" });
        reponse.render("ajouter", {
          errors,
          titre: "Ajout d'un usager",
          nom,
          login,
          password,
          password2,
          admin,
          vendeur,
        });
      } else {
        const newUser = new Usagers({
          _id: new mongoose.Types.ObjectId(),
          nom,
          login,
          pwd: password,
          role: roles,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.pwd, salt, (err, hash) => {
            if (err) throw err;
            newUser.pwd = hash;
            newUser
              .save()
              .then((usager) => {
                requete.flash("success_msg", "Usager inscrit à la BD!");
                reponse.redirect("/usagers");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Route pour modifier un usager (Id passé en params)
router.get("/editer/:id", estAdmin, (requete, reponse) => {
  const id = requete.params.id;
  Usagers.findById(id)
    .exec()
    .then((usager) => {
      reponse.render("editer", {
        titre: "Modifier un usager",
        usager,
      });
    })
    .catch((err) => console.log(err));
});

// Route pour modifier un usager (réception des données du formulaire)
router.post("/editer/:id", estAdmin, (requete, reponse) => {
  console.log(requete.body);
  const { nom, login, admin, vendeur } = requete.body;
  const id = requete.params.id;
  let errors = [];
  let roles = ["client"];
  if (admin === "on") roles.push("admin");
  if (vendeur === "on") roles.push("vendeur");

  /*if ( !nom || !login ) {
    errors.push({ msg: "Remplir toutes les cases du formulaire" });
  }*/
  if (errors.length > 0) {
    Usagers.findById(id)
      .exec()
      .then((usager) => {
        reponse.render("editer", {
          errors,
          titre: "Modifier un usager",
          usager,
          nom,
          login,
          admin,
          vendeur,
        });
      })
      .catch((err) => console.log(err));
  } else {
    Usagers.findOne({ login: login, _id: { $ne: id } }).then((user) => {
      if (user) {
        errors.push({ msg: "Ce courriel existe déjà" });
        Usagers.findById(id)
          .exec()
          .then((usager) => {
            reponse.render("editer", {
              errors,
              titre: "Modifier un usager",
              usager,
              nom,
              login,
              admin,
              vendeur,
            });
          })
          .catch((err) => console.log(err));
      } else {
        Usagers.findById(id)
          .exec()
          .then((usager) => {
            usager.nom = nom;
            usager.login = login;
            usager.role = roles;
            /*if (password) {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                  if (err) throw err;
                  usager.pwd = hash;
                 
                  usager
                    .save()
                    .then((usager) => {
                      requete.flash(
                        "success_msg",
                        "Usager modifié avec succès"
                      );
                      reponse.redirect("/usagers/menu");
                    })
                    .catch((err) => console.log(err));
                });
              });
            }*/

            usager
              .save()
              .then((usager) => {
                requete.flash("success_msg", "Usager modifié avec succès");
                reponse.redirect("/usagers/menu");
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    });
  }
});

// Route pour supprimer un usager (Id passé en params)
router.get("/supprimer/:id", estAdmin, (requete, reponse) => {
  const id = requete.params.id;

  Usagers.findByIdAndDelete(id)
    .exec()
    .then((usager) => {
      requete.flash("success_msg", "Usager supprimé avec succès");
      reponse.redirect("/usagers/menu");
    })
    .catch((err) => console.log(err));
});

/*// Fonction pour conserver le fichier image dans le dossier public
function conserverFichier(path, filename) {
  const newPath = nodeJSpath.join(__dirname, "../public/images", filename);
  fs.renameSync(path, newPath);
  return "/images/" + filename;
}

// Fonction pour supprimer le fichier image du dossier public
function supprimerFichier(path) {
  fs.unlink(path, (err) => {
    if (err) console.log(err);
  });
}*/

module.exports = router;
