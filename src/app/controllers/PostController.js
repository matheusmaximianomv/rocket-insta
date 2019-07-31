const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const Post = require('../models/Post');
const authToken = require('./../../helpers/token');

module.exports = {
    async index (req, res) {
        try {
            const posts = await Post.find().sort('-createdAt').populate('author', 'name  image');
            return res.status(200).json(posts);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro na Listagem');
        }
    },

    async store (req, res) {

        const { authorization } = req.headers;
        const author = await authToken.decodeToken(authToken.recoveToken(authorization));
        const { id } = author;

        const { place, description, hashtags } = req.body;
        const { filename : image } = req.file;

        const [name] = image.split('.');
        const fileName = `posts-${id}-${Date.now()}-${name}.jpg`;

        await sharp(req.file.path)
            .resize(400)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            );
        
        fs.unlinkSync(req.file.path);

        try {
            const post = await Post.create({
                author : id,
                place,
                description,
                hashtags,
                image : fileName
            });

            req.io.emit('post', post);
            return res.status(201).json(post);
        } catch(error) {
            console.log(error);
            return res.status(500).send('Error no Salvamento')
        }

    }
};