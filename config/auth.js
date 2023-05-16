module.exports = {
  estAuthentifie: function (req, rep, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Connectez-vous pour accéder au site");
    rep.redirect("/");
  },
  estAdmin: function (req, rep, next) {
    if (req.isAuthenticated()) {
      let admin = req.user.role.includes("admin");
      if (admin) {
        return next();
      } else {
        req.flash(
          "error_msg",
          'Vous devez être "admin" pour accéder à cette page'
        );
        rep.redirect("/usagers");
      }
    }
    req.flash("error_msg", "Connectez-vous pour accéder au site");
    rep.redirect("/");
  },
  estVendeur: function (req, rep, next) {
    if (req.isAuthenticated()) {
      let vendeur = req.user.role.includes("vendeur");
      if (vendeur) {
        return next();
      } else {
        req.flash(
          "error_msg",
          'Vous devez être "vendeur" pour accéder à cette page'
        );
        rep.redirect("/usagers");
      }
    }
    req.flash("error_msg", "Connectez-vous pour accéder au site");
    rep.redirect("/");
  },
  forwardAuthenticated: function (req, rep, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    rep.redirect("/usagers");
  },
};

