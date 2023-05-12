const mongoose = require("mongoose");

const semaineSchema = mongoose.Schema({
    jour : String,
    nbPersonneSemaine : Number,

})

const userSchema = mongoose.Schema({
  prenom: String,
  mail: String,
  password: String,
  photoProfil: String,
  preference: [String],
  nbPersonne : Number,
  Semaine : semaineSchema,
  recetteFavoris : [{
    type : mongoose.Schema.Types.ObjectId, ref : 'recettes'
  }],
});

const User = mongoose.model('users', userSchema);

module.exports = User;