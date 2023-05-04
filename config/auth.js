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
  estGestion: function (req, rep, next) {
    if (req.isAuthenticated()) {
      let gestion = req.user.role.includes("gestion");
      if (gestion) {
        return next();
      } else {
        req.flash(
          "error_msg",
          'Vous devez être "gestion" pour accéder à cette page'
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
