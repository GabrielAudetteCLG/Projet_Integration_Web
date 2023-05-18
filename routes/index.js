const express = require("express");
const router = express.Router();
const { estAuthentifie } = require("../config/auth");
const Articles = require("../modeles/articles");
const bodyParser = require("body-parser");

// Parse JSON request body
router.use(bodyParser.json());

// Routes qui redirect a ma page de login si entré dans l'url (/, /index.html, /index)
router.get("/", (requete, res) => res.redirect("/usagers/login"));
router.get("/index.html", (requete, res) => res.redirect("/usagers/login"));
router.get("/index", (requete, res) => res.redirect("/usagers/login"));

// Render de la page de login (seule page accessible si non connecté)
router.get("/usagers/login", (requete, reponse) =>
  reponse.render("login", { titre: "Login" })
);
router.get("/index", (requete, res) => res.redirect("/boutique"));
router.get("/menu", (requete, reponse) =>
  reponse.render("menu", { titre: "Menu" })
);
router.get("/boutique", (requete, reponse) =>
  Articles.find({}, null, { sort: { nom: 1 } })
    .exec()
    .then((articles) => {
      reponse.render("boutique", {
        articles: articles,
        titre: "Boutique",
      });
      console.log(articles);
    })
    .catch((err) => console.log(err))
);
//Get accueil
router.get("/accueil", (requete, reponse) => {
  reponse.render("accueil", { titre: "Accueil" });
});
// Get compte
router.get("/compte", estAuthentifie, (requete, reponse) => {
  reponse.render("compte", {
    titre: "Compte",
    user: requete.user,
  });
});
// get checkout
router.get("/checkout", estAuthentifie, (requete, reponse) => {
  reponse.render("checkout", { titre: "Checkout" });
});

// Get du logout (déconnexion)
router.get("/deconnexion", (requete, reponse, next) => {
  requete.logout((err) => {
    if (err) {
      return next(err);
    }
    requete.flash("success_msg", "Vous êtes déconnecté");
    reponse.redirect("/");
  });
});

//-	GET « /usagers/login » pour la page de connexion (authentification)
router.get("/", (requete, reponse) =>
  reponse.render("login", { titre: "Bienvenue " })
);

// Route pour panier
router.post("/checkout", (req, res) => {
  const panier = req.body.panier;
  res.render("checkout", { panier: panier });
});

module.exports = router;
