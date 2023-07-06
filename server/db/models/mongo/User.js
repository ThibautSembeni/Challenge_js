const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: [true, "Le nom est obligatoire"],
        minlength: [2, "Le nom doit contenir entre 2 et 50 caractères"],
        maxlength: [50, "Le nom doit contenir entre 2 et 50 caractères"],
        default: null,
    },
    firstname: {
        type: String,
        required: [true, "Le prénom est obligatoire"],
        minlength: [2, "Le prénom doit contenir entre 2 et 50 caractères"],
        maxlength: [50, "Le prénom doit contenir entre 2 et 50 caractères"],
        default: null,
    },
    company: {
        type: String,
        minlength: [
            2,
            "Le nom de la société doit contenir entre 2 et 50 caractères",
        ],
        maxlength: [
            50,
            "Le nom de la société doit contenir entre 2 et 50 caractères",
        ],
        default: null,
    },
    phone_number: {
        type: String,
        minlength: [10, "Le numéro de téléphone doit contenir 10 chiffres"],
        maxlength: [10, "Le numéro de téléphone doit contenir 10 chiffres"],
        default: null,
    },
    email: {
        type: String,
        unique: [true, "L'email est déjà utilisé"],
        required: [true, "L'email est obligatoire"],
        default: null,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
        },
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est obligatoire"],
        minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
        maxlength: [32, "Le mot de passe doit contenir au maximum 32 caractères"],
        default: null,
    },
    confirmation_url: {
        type: String,
        default: null,
    },
    cancellation_url: {
        type: String,
        default: null,
    },
    payout_currency: {
        type: String,
        validate: {
            validator: function (v) {
                return /^([E][U][R]|[U][S][D])$/.test(v);
            },
        },
        default: 'EUR',
    },
    role: {
        type: String,
        required: [true, "Le rôle est obligatoire"],
        default: "customer",
        validate: {
            validator: function (v) {
                return /^(admin|merchant|customer)$/.test(v);
            },
        },
    },
    kbis: {
        type: String,
        minlength: [2, "Le nom du fichier doit contenir entre 2 et 100 caractères"],
        maxlength: [
            100,
            "Le nom du fichier doit contenir entre 2 et 100 caractères",
        ],
        default: null,
    },
});

module.exports = mongoose.model("User", utilisateurSchema);
