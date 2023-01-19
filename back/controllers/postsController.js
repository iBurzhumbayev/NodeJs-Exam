const { PostModel, UserModel } = require('../Models')
const { validationResult } = require('express-validator')

class postController {
    async getPosts(req, res) {
        try {
            const posts = await PostModel.find()
            res.json(posts)
        } catch (e) {
            console.log(e)
        }
    }

    async createPost(req, res) {
        try {
            const {postHeader, postData, userId} = req.body;
            const author = await UserModel.findById(userId);

            const newPost = new PostModel({postHeader, postData, author, postLikes: []});
            await newPost.save()
            return res.json({message: "Пост успешно создан"})
        } catch (e) {
            console.log(e)
            res.status(500).send('Ошибка создания поста')
        }
    }

    async deletePost(req, res) {
        try {
            await PostModel.deleteOne({_id: req.params.id})
            return res.json({message: "Пост удален"})
        } catch (e) {
            console.log(e)
            res.status(500).send('Ошибка удаления')
        }
    }

    async editPost(req, res) {
        try {
            const {id} = req.params
            const { postData } = req.body;
            await PostModel.findByIdAndUpdate(id, {postData})
            res.send("Пост отредактирован");
        } catch (e) {
            console.log(e)
            res.status(500).send('Ошибка редактирования')
        }
    }

    async likes(req, res) {
        try {
            const {userId} = req.body;
            const postId = req.params.id;

            let post = await PostModel.findById(postId);
            const likeUser = await UserModel.findById(userId);
            if (post.postLikes.find(e => e._id == userId)) {
                post.postLikes = post.postLikes.filter(user => user._id != userId)
                res.json({message: "Лайк удален"})
            } else {
                post.postLikes.push(likeUser);
                res.json({message: "поставлен"})
            }
            await post.save()
        } catch (e) {
            console.log(e)
            res.status(500).send('Ошибка')
        }
    }
}

module.exports = new postController()