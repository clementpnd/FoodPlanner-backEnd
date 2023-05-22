var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Recette = require("../models/recettes");
const User = require("../models/users");

//route qui recupère toutes les recettes
router.get("/", (req, res) => {
  Recette.find()
    .populate("ingredients")
    .then((data) => {
      res.json({ data: data });
    });
});

router.get("/suggestion", (req, res) => {
  Recette.find().then((data) => {
    res.json({ data: data });
  });
});

router.post("/recettePref", (req, res) => {
  let pref = [];
  User.find({ token: req.body.token }).then((data) => {
    console.log(data)
    pref = data[0].preference;
  });

  if (pref.length > 0) {
    Recette.find().then((data) => {
      if (pref.length > 0) {
        Recette.find({ type: { $in: pref } }).then((data) => {
          let responseRecette = [];
          for (let recette in data) {
            responseRecette.push(data[recette]);
          }
          const shuffledArray = responseRecette.sort(() => 0.5 - Math.random());
          const response = shuffledArray.slice(0, 3);
          res.json({ pref: true, responseRecette: response });
        });
      }
    });
  } else {
    Recette.find().then((data) => {
      const shuffledArray = data.sort(() => 0.5 - Math.random());
      const response = shuffledArray.slice(0, 3);
      res.json({ pref: false, responseRecette: response });
    });
  }
});
module.exports = router;
