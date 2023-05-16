var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Recette = require("../models/recettes");

//route qui recupère toutes les recettes
router.get("/", (req, res) => {
  Recette.find().then((data) => {
    res.json({ data: data });
  });
});

module.exports = router;
