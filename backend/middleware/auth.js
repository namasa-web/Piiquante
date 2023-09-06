// Importations
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Exportation de la fonction du middleware
module.exports = (req, res, next) => {
    try {
      // récuperation du token dans le header
      const token = req.headers.authorization.split(" ")[1];
      // comparaison du userId de la demande avec celui extrait du token 
      const decodedToken = jwt.verify(token, process.env.TOKEN_ENCODED); 
      const userId = decodedToken.userId;
      if (req.body.userId && req.body.userId !== userId) {
        throw "utilisateur non valide";
      } else {
        req.auth = {
          userId: userId
      };
        next();
      }
    // S'il y a des erreurs dans le try on les récupères ici
    } catch(error) {
      res
        .status(401)
        .json({
          message: "vous n\' êtes pas autorisé à accéder à cette page",
          data: error,
        });
    }
  };