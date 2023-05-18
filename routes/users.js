var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const User = require("../models/users");
const Semaine = require("../models/users");
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
        pseudo: req.body.pseudo,
        mail: req.body.mail,
        password: hash,
        nbPersonne: req.body.nbPersonne,
        photoProfil: req.body.photoProfil,
        preference: req.body.preference,
        semaine: []
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

//Vérifie si un User est déja présent
router.post("/verify", (req, res) => {
  if (!checkBody(req.body, ["mail"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ mail: req.body.mail }).then((data) => {
    if (data !== null) {
      res.json({ result: false, error: "User already exists" });
    } else {
      res.json({ result: true });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["mail", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ mail: req.body.mail }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});
;


// route GET qui récupère le nombre de personnes enregistré dans le profil pour réutiliser dans la semaine
router.get("/nbPersonne/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    console.log(user)
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    } else {
      res.json({ result: true, nbPersonne: user.nbPersonne });
    }
  });
});


 
//route PUT qui permet de créer la semaine type
  router.put('/newsemaine/:token', (req, res) => {
    User.findOne({ token: req.params.token })
    //.populate('semaines')
    .then(user => {
     if (user === null) {
         res.json({ result: false, error: 'User not found' });
         return;
       }
      else {
        //let semaines = [{jour: newJour, midi: newMidi, soir: newSoir, repas: newRepas, nbPersonneSemaine: newNbPersonneSemaine}];
         User.updateOne(
     {token: req.params.token},
     //{$addToSet: {semaines: {jour: req.body.jour, nbPersonneSemaine: req.body.nbPersonneSemaine}}})
     
     {$push: {semaines: 
         [{
        jour: req.body.jour,
        midi: req.body.midi,
        soir: req.body.soir,
        repas: req.body.repas,
        nbPersonneSemaine: req.body.nbPersonneSemaine,
      }],}})
         .then((user) => {
           console.log("après set", user.semaines)
           res.json({ result: true, semaines: user });

         });}
         
   });
    });

   
   
// route GET qui récupère les semaines enregistrées dans le profil pour réutiliser dans la semaine
router.get('/semaines/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }
    else { res.json({ result: true, semaines: user.semaines });}
  });
});


// route PUT qui permet de modifier la semaine type déjà enrgistrée
 router.put('/semaines/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    } else {
      //let semaines = [{jour: "", midi: "", soir: "", repas: "", nbPersonneSemaine: ""}]
      User.updateOne(
        { token: req.body.token },
        {
          $set: {
            semaines: {
              jour: jour,
              midi: midi,
              soir: soir,
              repas: repas,
              nbPersonneSemaine: nbPersonneSemaine,
            },
          },
        }
      )
      .then((data) => {
        console.log(data);
        res.json({ result: true, semaines: data });
      });
    }
  });
});

// route GET qui permet de récupérer la semaine en cours
router.get("/lastsemaine/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }

    User.find({ semaines: req.body.semaines }).then((semaines) => {
      res.json({ result: true, semaines: semaines.lastIndexOf() });
    });
  });
});

// route GET qui permet de récupérer les ingrédients des recettes du semainier
router.get("/ingredients/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    } else {
      res.json({ result: true, ingredients: user.ingredients });
    }
  });
});

// route Get qui permet de récuperer toutes les semaines enregistrées en favoris
router.get("/semaines/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }

    User.find({ semaines: req.body.semaines }).then((semaines) => {
      res.json({ result: true, semaines });
    });
  });
});

// route PUT qui permet de modifier la semaine type déjà enrgistrée
router.put("/semaines", (req, res) => {
  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    User.findOne(req.body.semaines).then((semaines) => {
      if (!semaines) {
        res.json({ result: false, error: "Semaine n'existe pas" });
        return;
      } else {
        User.updateOne({ semaines: { jour, nbPersonneSemaine } }).then(() => {
          res.json({ result: true });
        });
      }
    });
  });
});

module.exports = router;
