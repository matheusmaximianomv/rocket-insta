const jwt = require('jsonwebtoken');

const { SECRET_AUTH } = require('../../config/auth');
const authToken = require('../../helpers/token');

module.exports = {
    async authorized(req, res, next) {
        const token = authToken.recoveToken(req.headers.authorization);

        if(!token) {
            return res.status(401).send("Você não está autenticado.");
        } else {
            jwt.verify(token, SECRET_AUTH, (error, decoded) => {
                if(error)
                    return res.status(401).send("Você não está autenticado.");
                return next();
            })
        }

        // Não da certo, não sei pq.
        /*if(token) {
            await jwt.verify(token, SECRET_AUTH, (error, decoded) => {
                if(error) {
                    console.log(error);
                    return res.status(401).send("Você não está autenticado.");
                }
                return next();
            })
        }

        return res.status(401).send("Você não está autenticado.");*/
    }
}