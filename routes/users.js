var express = require('express');
var router = express.Router();
require('../models/connection');
const User = require('../models/users');
//const Recette = require('../models/recettes');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});























// route GET qui récupère le nombre de personnes enregistré dans le profil pour réutiliser dans la semaine
 router.get('/nbPersonne/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    User.findOne({ nbPersonne : req.body.nbPersonne })
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

    User.findOne({ semaines : req.body.semaines })
      .then(data => {
        res.json({ result: true, semaines: data.semaines.lastIndexOf()});
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

    User.findOne({ semaines : req.body.semaines })
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
        User.updateOne({ semaines: {jour, nbPersonneSemaine}})
          .then(() => {
            res.json({ result: true });
          });

      }
    });
  });
});
module.exports = router;


