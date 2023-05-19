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
    pref = data[0].preference;
  });

  Recette.find().then((data) => {
    if (pref.length > 0) {
      let responseRecette =[];
      pref.map((prefe) => {
        Recette.find({ type: `${prefe}` }).then((data) => {

          for(let i =0; i<data.length; i++){
            responseRecette.push(data)
          }
          console.log(responseRecette)
          // data.map((recette, i) => {
          //   console.log("round ", i, " recette ", recette.nom);
          //   responseRecette.push(recette);
          //   console.log('responseRecette',responseRecette)
          // });
        });
        res.json({ pref: true, responseRecette: responseRecette });
      });
    }
  });
});
module.exports = router;
