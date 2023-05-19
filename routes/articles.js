const express = require("express");
const router = express.Router();
const nodeJSpath = require("path");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Articles = require("../modeles/articles");
const mongoose = require("mongoose");

const { estAuthentifie, estVendeur } = require("../config/auth");

// Configuration de Multer pour gérer les fichiers
const storage = multer.diskStorage({
  destination: (requete, fichier, callback) => {
    callback(null, "../uploads"); // Spécifiez le chemin de destination des fichiers
  },
  filename: (requete, fichier, callback) => {
    callback(null, fichier.originalname);
  },
});

// Route pour afficher la liste des articles
router.get("/", estAuthentifie, (req, res) => {
  res.render("menuArticles", { titre: "Gestion des articles", user: req.user });
});

// Route pour afficher la liste des articles

router.get("/menu", estAuthentifie, estVendeur, (requete, res) => {
  console.log(requete.user);
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
router.get("/editer/:_id", estVendeur, (req, res) => {
  const _id = req.params._id;
  Articles.findOne({
    _id: _id,
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

// Route pour traiter la soumission du formulaire de modification d'un article (Gabriel)

router.post("/editer", estVendeur, (req, res) => {
  const { nom, marque, prix, details } = req.body;

  const file = req.files ? req.files[0] : null; // Vérifier si req.files contient des éléments
  console.log(file);
  if (file) {
    const { originalname, destination, filename, size, path, mimetype } =
      req.files[0];
    const maxFileSize = 1024 * 1000;
    const mimetypePermis = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/webp",
    ];
    let errors = [];
    if (!nom || !marque || !prix || !details) {
      errors.push({ msg: "Remplir toutes les cases du formulaire" });
    }
    if (size > maxFileSize) {
      errors.push({
        msg: `La taille du fichier est trop grande (max ${maxFileSize} octets)`,
      });
    } else if (!mimetypePermis.includes(mimetype)) {
      errors.push({ msg: "Format de fichier non accepté" });
    }

    if (errors.length > 0) {
      supprimerFichier(path);
      res.render("articles", {
        errors,
        nom,
        marque,
        prix,
        details,
        titre: "Modification d'un article",
        image: filename,
      });
      return;
    } else {
      Articles.findOneAndUpdate(
        { nom: nom },
        {
          nom,
          imageFond: file ? conserverFichier(path, filename) : null, // Vérifier si file est défini avant de déstructurer ses propriétés
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
    }
  } else {
    req.flash("error_msg", "Veuillez sélectionner une image");
    res.redirect("/articles/editer");
    return;
  }

  console.log("req.body :", req.body);
});

// -------------------------------------------------------------------------------------------------

// // Route pour traiter la soumission du formulaire de modification d'un article
// router.post("/editer", estVendeur, (req, res) => {
//   const { nom, marque, prix, details } = req.body;

//   const file = req.files ? req.files[0] : null; // Vérifier si req.files contient des éléments

//   if (file) {
//     const { originalname, destination, filename, size, path, mimetype } = file;
//     const maxFileSize = 1024 * 10;
//     const mimetypePermis = [
//       "image/png",
//       "image/jpg",
//       "image/jpeg",
//       "image/gif",
//       "image/webp",
//       "css",
//     ];
//     let errors = [];
//     if (size > maxFileSize) {
//       errors.push({
//         msg: `La taille du fichier est trop grande (max ${maxFileSize} octets)`,
//       });
//     } else {
//       if (!mimetypePermis.includes(mimetype)) {
//         errors.push({ msg: "Format de fichier non accepté" });
//       }
//     }

//     if (errors.length > 0) {
//       supprimerFichier(path);
//       res.render("articles", {
//         errors,
//         nom,
//         marque,
//         prix,
//         details,
//         titre: "Modification d'un article",
//       });
//       return; // Terminer la fonction ici pour éviter l'erreur suivante causée par 'path' qui est indéfini
//     }
//   }

//   Articles.findOneAndUpdate(
//     { nom: nom },
//     {
//       nom,
//       imageFond: file ? conserverFichier(path, filename) : null, // Vérifier si file est défini avant de déstructurer ses propriétés
//       marque,
//       prix,
//       details,
//     },
//     { new: true }
//   )
//     .then((article) => {
//       req.flash("success_msg", "L'article a été modifié avec succès");
//       res.redirect("/articles/menu");
//     })
//     .catch((err) => console.log(err));

//   console.log("req.body :", req.body);
// });

// Route pour afficher le formulaire d'ajout d'un article
router.get("/ajouter", estVendeur, (req, res) => {
  res.render("articlesAjouter", { titre: "Ajouter un produit" });
});


router.post("/ajouter", estVendeur, (requete, reponse) => {
  const { nom, marque, prix, details } = requete.body;
  const { originalname, destination, filename, size, path, mimetype } =
    requete.files[0];
  const maxFileSize = 1024 * 1000;
  const mimetypePermis = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
  ];
  let errors = [];

  if (!nom || !marque || !prix || !details) {
    errors.push({ msg: "Remplir toutes les cases du formulaire" });
  }

  if (size > maxFileSize) {
    errors.push({
      msg: `La taille du fichier est trop grande (max ${maxFileSize} octets)
      `,
    });
  } else if (!mimetypePermis.includes(mimetype)) {
    errors.push({ msg: "Format de fichier non accepté" });
  }

  if (errors.length > 0) {
    supprimerFichier(path);
    reponse.render("articlesAjouter", {
      errors,
      titre: "Ajout d'un article",
      nom,
      image: filename, // Utilisez 'filename' à la place de 'image'
      marque,
      prix,
      details,
    });
  } else {
    Articles.findOne({ nom: nom }).then((article) => {
      if (article) {
        supprimerFichier(path);
        errors.push({ msg: "Cet article existe déjà" });
        reponse.render("articlesAjouter", {
          errors,
          titre: "Ajout d'un article",
          nom,
          image: filename, // Utilisez 'filename' à la place de 'image'
          marque,
          prix,
          details,
        });
      } else {
        const nouvelArticle = new Articles({
          nom,
          image: filename, // Utilisez 'filename' à la place de 'image'
          marque,
          prix,
          details,
        });

        console.log("nouvelArticle:", nouvelArticle);

        nouvelArticle.imageFond = conserverFichier(path, filename);

        nouvelArticle
          .save()
          .then((article) => {
            requete.flash("success_msg", "Article ajouté à la base de données");
            reponse.redirect("/articles/menu");
          })
          .catch((err) => console.log(err));
      }
    });
  }
});

function supprimerFichier(path) {
  const nomFichier = nodeJSpath.join(__dirname, "..", path);
  fs.unlink(nomFichier, (err) => {
    if (err) console.log(err);
    else console.log("fichier supprimé:", nomFichier);
  });
}

function conserverFichier(path, filename) {
  const nomFichier = nodeJSpath.join(__dirname, "..", path);
  const nouveauNom = nodeJSpath.join(__dirname, "..", "images", filename);

  // Vérifier si le fichier existe
  if (fs.existsSync(nomFichier)) {
    // Vérifier si le dossier de destination existe
    if (fs.existsSync(nodeJSpath.dirname(nouveauNom))) {
      fs.renameSync(nomFichier, nouveauNom); // Utiliser fs.renameSync pour déplacer le fichier de manière synchrone

      console.log("fichier déplacé vers", nouveauNom);

      return filename; // Retourner le nom de fichier déplacé
    } else {
      console.log(
        "Le dossier de destination n'existe pas :",
        nodeJSpath.dirname(nouveauNom)
      );
    }
  } else {
    console.log("Le fichier n'existe pas :", nomFichier);
  }

  return null; // Retourner null en cas d'erreur ou si le fichier n'existe pas
}

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

// Fonction pour supprimer un fichier si le fichier n'est pas valide
function supprimerFichier(path) {
  let nomFichier = nodeJSpath.join(__dirname, "..", path);
  fs.unlink(nomFichier, (err) => {
    if (err) console.log(err);
    else console.log("fichier supprimé:", nomFichier);
  });
}

// Fonction pour déplacer un fichier vers le dossier images
function conserverFichier(path, filename) {
  let nomFichier = nodeJSpath.join(__dirname, "..", path);
  let nouveauNom = nodeJSpath.join(__dirname, "..", "images", filename);
  fs.rename(nomFichier, nouveauNom, (err) => {
    if (err) console.log(err);
    else console.log("fichier déplacé vers ", nouveauNom);
  });
  return filename;
}

module.exports = router;
