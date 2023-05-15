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
        pseudo: req.body.pseudo,
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

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['mail', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({ mail: req.body.mail }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  })
})


    // route GET qui récupère le nombre de personnes enregistré dans le profil pour réutiliser dans la semaine
    router.get('/nbPersonne/:token', (req, res) => {
      User.findOne({ token: req.params.token }).then(user => {
        if (user === null) {
          res.json({ result: false, error: 'User not found' });
          return;
        }

        User.findOne({ nbPersonne: req.body.nbPersonne })
          .then(nbPersonne => {
            res.json({ result: true, nbPersonne });
          });
      });
    });





    // route POST qui enregistre la semaine pour pouvoir la réutiliser ultérieurement
    router.post('/semaine/:token', (req, res) => {
      //vérifie que l'user est connecté
      User.findOne({ token: req.body.token }).then(user => {
        if (user === null) {
          res.json({ result: false, error: 'User not found' });
          return;
        }
        //récupère le nombre de personnes enrgistré dans le profil
        // User.findOne({ nbPersonne : req.body.nbPersonne })
        // .then(nbPersonne => {
        //   res.json({ result: true, nbPersonne });
        // });

        const newSemaine = new Semaine({
          jour: req.body.jour,
          nbPersonneSemaine: req.body.nbPersonneSemaine,
        });

        newSemaine.save().then(newDoc => {
          res.json({ result: true, semaine: newDoc });
        });
      });
    });


    // route GET qui permet de récupérer la semaine en cours
    router.get('/lastsemaine/:token', (req, res) => {
      User.findOne({ token: req.params.token }).then(user => {
        if (user === null) {
          res.json({ result: false, error: 'User not found' });
          return;
        }

        User.findOne({ semaines: req.body.semaines })
          .then(data => {
            res.json({ result: true, semaines: data.semaines.lastIndexOf() });
          });
      });
    });


    // route Get qui permet de récuperer toutes les semaines enregistrées en favoris
    router.get('/semaines/:token', (req, res) => {
      User.findOne({ token: req.params.token }).then(user => {
        if (user === null) {
          res.json({ result: false, error: 'User not found' });
          return;
        }

        User.findOne({ semaines: req.body.semaines })
          .then(semaines => {
            res.json({ result: true, semaines });
          });
      });
    });

    // route PUT qui permet de modifier la semaine type déjà enrgistrée
    router.put('/semaines', (req, res) => {
      User.findOne({ token: req.body.token }).then(user => {
        if (user === null) {
          res.json({ result: false, error: 'User not found' });
          return;
        }
        User.findOne(req.body.semaines).then(semaines => {
          if (!semaines) {
            res.json({ result: false, error: "Semaine n'existe pas" });
            return;
          }

          else {
            User.updateOne({ semaines: { jour, nbPersonneSemaine } })
              .then(() => {
                res.json({ result: true });
              });

          }
        });
      });
    });

    module.exports = router;


