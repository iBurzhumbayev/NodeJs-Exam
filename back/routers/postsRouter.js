const express = require('express');
const { PostModel, UserModel } = require('../Models');
const {getPosts, createPost, deletePost, likes, editPost} = require('../controllers/postsController')
const router = express.Router();

router.get('/', getPosts);

router.post('/', createPost);

router.post('/likes/:id', likes);

router.delete("/:id", deletePost)

router.put("/:id", editPost);

module.exports = router;