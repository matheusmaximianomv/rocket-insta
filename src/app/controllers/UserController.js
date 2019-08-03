const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const authToken = require('./../../helpers/token');

module.exports = {

    async index(req, res) {
        try {
            const users = await User.find({},"_id name email image");
            return res.status(200).json(users);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro na Listagem');
        }
    },

    async show(req, res) {
        const { authorization } = req.headers;
        const author = await authToken.decodeToken(authToken.recoveToken(authorization));
        const { id } = author;

        try {
            const user = await User.findOne({ _id : id },"_id name email image");
            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro na Listagem');
        }
    },

    async store(req, res) {
        const { name, email, password } = req.body;

        if (name.length < 5 || email.length < 5 || password.length < 8)
            return res.status(400).send('Campos com tamanhos insuficientes');

        try {
            const user = await User.findOne({ email }, 'email');
            if(user)
            return res.status(400).json({ erro : { description: 'Esse email já está sendo utilizado' }});
        } catch (error) {
            return res.status(500).send(erro);
        }
        
        bcrypt.genSalt(12, (error, salt) => {
            if (error)
                return res.status(500).send('Erro ao salvar o usuário');
            bcrypt.hash(password, salt, async (error, hash) => {
                if (error)
                    return res.status(500).send('Erro ao salvar o usuário');     
                try {
                    const newUser = await User.create({
                        name,
                        email,
                        password : hash
                    });

                    newUser.password = undefined;

                    return res.status(201).json(newUser);
                } catch (error) {
                    console.log(error);
                    return res.status(500).send('Erro ao salvar o usuário');
                }
            })
        })

    },

    async update(req, res) {

        const { authorization } = req.headers;
        const author = await authToken.decodeToken(authToken.recoveToken(authorization));
        const { id } = author;

        try {
            const user = await User.findById(id);

            if(!user)
                return res.status(200).json({result : "User not found"});
        
            const { name, email } = req.body;
            
            if(req.file) {
                const { filename : image, path : pathImage, destination } = req.file;
                const [nameImg] = image.split('.');
                const fileName = `profile-${id}-${Date.now()}-${nameImg}.jpg`;
    
                await sharp(pathImage)
                    .resize(400)
                    .jpeg({quality : 70})
                    .toFile(
                        path.resolve(destination, 'resized', fileName)
                    );
        
                fs.unlinkSync(pathImage);

                user.image = fileName;
            }

            user.name = name;
            user.email = email;
            user.__v += 1; 
            
            try {
                await user.save();
                return res.status(200).json(user);
            } catch (error) {
                return res.status(500).send('Esse email já está em uso');
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro ao pesquisar usuário');
        }

        
    }
}