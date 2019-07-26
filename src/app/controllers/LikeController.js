const Post = require('../models/Post');

module.exports = {
    async store (req, res) {
        const { id } = req.params;
        
        try {
            const post = await Post.findById(id);
            try {
                post.likes += 1;
                await post.save();


            req.io.emit('like', post);

                return res.status(200).json(post);
            } catch (error) {
                console.log(error);
                return res.status(500).send('Erro ao Contabilizar o Like');
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro ao Encontrar a Postagem');
        }
    }
};