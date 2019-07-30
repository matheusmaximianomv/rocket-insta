const bycrypt = require('bcryptjs');

const User = require('./../models/User');
const authToken = require('./../../helpers/token');

module.exports = {
    async signin(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email }, '+password');
            if(!user) 
                return res.status(400).json({ erro : { description: 'Email ou senha inválidos' }});
            if(await bycrypt.compare(password, user.password)) {
    
                const { _id, email : Email, name, image } = user;
                const token = await authToken.generateToken({ id : _id, email : Email, name, image});
    
                return res.status(200).send({ token, email : Email, name, image});
            } else 
                return res.status(400).json({ erro : { description: 'Email ou senha inválidos' }});
            
        } catch (error) {
            console.log(error);
            return res.status(500).send({ erro : 'Não foi possível encontrar o email.' });
        }
    }
}