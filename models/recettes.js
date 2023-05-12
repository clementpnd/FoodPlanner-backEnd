const mongoose = require("mongoose");

const ingredientsSchema = mongoose.model({
    nom : String,
    type : String,
    quantite : String,
    image : String,
})

const recetteSchema = mongoose.Schema({

    nom : String, 
    description : String,
    temps : Date,
    difficulte : String,
    instruction : String,
    image : String,
    ingredients : ingredientsSchema,
})


const Recette = mongoose.model('recettes', recetteSchema);

module.exports = Recette;