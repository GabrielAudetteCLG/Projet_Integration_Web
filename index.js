const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");

// Configure OpenAI with your API key from the environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openaiApi = new OpenAIApi(configuration);

// Route pour gérer les requêtes de chatbot
app.post("/chatbot", express.json(), async (req, res) => {
  const userInput = req.body.message;
  // console.log(userInput)

  try {
    // Utilisez la nouvelle configuration et le modèle gpt-3.5-turbo
    const response = await openaiApi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }],
    });

    const chatbotReply = response.data.choices[0].message.content.trim();
    // console.log(chatbotReply)
    res.json({ message: chatbotReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la communication avec l'assistant virtuel",
    });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  },
});
app.use(upload.any());

// Connexion a la base de données
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://gabrielAudette:mdptemporaire999@cluster0.kjrwzmy.mongodb.net/web2_PFI"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log(`Connexion a la BD établie`));

// Passport Config
require("./config/passport")(passport);
app.use(expressLayouts);

// récupérer les variables recues de post (dans la requête)
app.use(express.urlencoded({ extended: false }));

// Création de la session express
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// Initialisation de passport
app.use(passport.initialize());
app.use(passport.session());

// Connexion a flash
app.use(flash());

// variables a définir pour le fonctionnement de l'authentification
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Route pour les messages flash
app.get("/", (req, res) => {
  req.flash("success_msg", "Message flash de succès");
  req.flash("error_msg", "Message flash d'erreur");
  req.flash("error", "Une erreur s'est produite");

  res.render("login");
});

app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/images", express.static("./images"));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Les routes
app.use("/", require("./routes/index"));
app.use("/usagers", require("./routes/usagers"));
app.use("/articles", require("./routes/articles"));

// Les vues
app.set("views", "./pagesEJS");
app.set("view engine", "ejs");

app.listen(PORT, console.log(`Server started on port ${PORT}`));
