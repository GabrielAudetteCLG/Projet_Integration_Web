const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// charger le modèle pour la collection usagers
const Usagers = require("../modeles/usagers");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "login" }, (login, password, done) => {
      Usagers.findOne({ login: login })
        .then((usager) => {
          if (!usager) {
            return done(null, false, { message: `Ce login n'existe pas!` });
          }
          bcrypt.compare(password, usager.pwd, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, usager);
            } else {
              return done(null, false, { message: "Mot de passe invalide" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  passport.serializeUser(function (usager, done) {
    done(null, usager.login);
  });
  passport.deserializeUser(function (login, done) {
    Usagers.findOne({ login: login })
      .then((usager) => done(null, usager))
      .catch((err) => done(err, null));
  });
};
