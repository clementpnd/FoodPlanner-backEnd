const mongoose = require("mongoose");

const semaineSchema = mongoose.Schema({
    jour: String,
    midi: Boolean,
    soir: Boolean,
    repas: Boolean,
    nbPersonneSemaine: Number,

})

const userSchema = mongoose.Schema({
  token: String,
  prenom: String,
  pseudo: String,
  mail: String,
  password: String,
  photoProfil: String,
  nbPersonne: Number,
  preference: [String],
  semaines: [semaineSchema],
  recetteFavoris: [{
    type : mongoose.Schema.Types.ObjectId, ref : 'recettes'
  }],
});

const User = mongoose.model('users', userSchema);
const Semaine = mongoose.model('users', userSchema);
module.exports = User, Semaine;