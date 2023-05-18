const mongoose = require("mongoose");

const ingredientsSchema = mongoose.Schema({
  nom: String,
  type: String,
  quantite: String,
  image: String,
});

const recetteSchema = mongoose.Schema({
  nom: String,
  type : String,
  description: String,
  temps: String,
  difficulte: String,
  instruction: [String],
  image: String,
  ingredients: [ingredientsSchema],
});

const Recette = mongoose.model("recettes", recetteSchema);

module.exports = Recette;
