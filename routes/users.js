var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const User = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//CREER UN UTILISATEUR
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["prenom", "mail", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Check if the user has not already been registered
  User.findOne({ mail: req.body.mail }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        token: uid2(32),
        prenom: req.body.prenom,
        mail: req.body.mail,
        password: hash,
        photoProfil: req.body.photoProfil,
        preference: req.body.preference,
        nbPersonne: req.body.number,
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});





module.exports = router;
