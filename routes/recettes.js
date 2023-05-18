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
  let responseRecette = [];
  User.find({ token: req.body.token }).then((data) => {
      pref = data[0].preference;

  });

  Recette.find().then((data) => {
    if(pref.length > 0 ){
    pref.map((prefe) => {
      responseRecette.push(data.filter((recette) => recette.type === prefe));
    });
    res.json({pref : true, responseRecette: responseRecette });
  }
  else{
    res.json({pref : false,responseRecette : data})
  }
  });
});
module.exports = router;
