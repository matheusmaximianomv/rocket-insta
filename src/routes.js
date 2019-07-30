const express = require('express');
const multer = require('multer');

const routes = new express.Router();
const uploadConfig = require('./config/upload');
const upload = multer(uploadConfig);

const authorization = require('./app/middlewares/authorization');

/* Home */
routes.get('/', (req, res) => {
    return res.status(200).send("Welcome to the API - RocketInsta");
});

/* Posts */
const PostController = require('./app/controllers/PostController');

routes.get('/posts', authorization.authorized, PostController.index);
routes.post('/posts', authorization.authorized , upload.single('image'), PostController.store);
// likes
const LikeController = require('./app/controllers/LikeController');
routes.post('/posts/:id/like', authorization.authorized, LikeController.store)

/* Users */
const UserController = require('./app/controllers/UserController');

routes.get('/users', authorization.authorized, UserController.index);
routes.get('/users/profile', authorization.authorized, UserController.show);
routes.post('/users/signup', upload.any(), UserController.store);
routes.put('/users', authorization.authorized, upload.single('image'), UserController.update);
// Login
const AuthenticateController = require('./app/controllers/AuthenticateController');
routes.post('/users/signin', upload.any(), AuthenticateController.signin);

module.exports = routes;