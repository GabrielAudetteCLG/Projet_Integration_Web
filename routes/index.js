const express = require("express");
const router = express.Router();

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
  reponse.render("boutique", { titre: "Boutique" })
);
//Get accueil
router.get("/accueil", (requete, reponse) => {
  reponse.render("accueil", { titre: "Accueil" });
});
// Get compte
router.get("/compte", (requete, reponse) => {
  reponse.render("compte", { titre: "Compte" });
});

// Get du logout (déconnexion)
router.get("/logout", (requete, reponse, next) => {
  requete.logout((err) => {
    if (err) {
      return next(err);
    }
    requete.flash("success_msg", "Vous êtes déconnecté");
    reponse.redirect("/");
  });
});

module.exports = router;
