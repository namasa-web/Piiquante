const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

require('dotenv').config()

exports.signup = (req, res, next) => {
	// Expression régulière pour valider le format du mot de passe (au moins 8 caractères, une lettre en capitale, un chiffre)
    const isPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
	if (req.body.password.match(isPassword)) {
		bcrypt.hash(req.body.password, 10)
		  .then(hash => {
			const user = new User({
				email: req.body.email,
				password: hash
			});
			user.save()
				.then(() => res.status(201).json({message: 'Utilisateur créé !'}))
				.catch(error => res.status(400).json({error}));
		  })
		  .catch(error => res.status(500).json({error}));
		}
	 // Si le mot de passe ne correspond pas au format requis
        else {
            res.status(401).json({
                message:
                    "votre mot de passe doit contenir entre 8 et 20 caractères, avec au moins 1 lettre en capitale et 1 chiffre",
            });


        }
  };
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_ENCODED,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };