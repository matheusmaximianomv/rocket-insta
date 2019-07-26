const jwt = require('jsonwebtoken');
const { SECRET_AUTH } = require('../config/auth');

module.exports = {

    async generateToken(data) {
        return await jwt.sign(data, SECRET_AUTH, {
            expiresIn : '1d'
        });
    },

    async decodeToken(token) {
        const data = await jwt.verify(token, SECRET_AUTH);
        return data;
    },

    recoveToken(authorization) {

        if(authorization) {
            const parts = authorization.split(' ');
  
            if (!parts.length === 2)
                return null;
  
            const scheme  = parts[0];
  
            if (!/^Bearer$/i.test(scheme))
                return null;
            
            return parts[1];
        }

        return null;
    }
}

