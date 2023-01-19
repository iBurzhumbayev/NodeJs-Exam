const { UserModel, PostModel } = require('../Models')
const { validationResult } = require('express-validator')

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {fullName, fullSurname, login, password} = req.body;
            const candidate = await UserModel.findOne({login})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким логином уже существует"})
            }
            const newUser = new UserModel({fullName, fullSurname, login, password, subscribers: []});
            await newUser.save()
            return res.json({message: "Пользователь успешно зарегистрирован"})
        } catch (e) {
            console.log(e)
            res.status(500).send('Registration error')
        }
    }

    async deleteUser(req, res) {
        try {
            const candidate = await UserModel.findOne({_id: req.params.id})
            if (!candidate) {
                return res.status(400).json({message: "Пользователь не найден"})
            }
            await UserModel.deleteOne({_id: req.params.id})
            return res.json({message: "Пользователь успешно удален"})
        } catch (e) {
            console.log(e)
            res.status(500).send('Delete error')
        }
    }

    async editUser (req, res) {
        const {id} = req.params
        const { fullName, fullSurname } = req.body;
        await UserModel.findByIdAndUpdate(id,{fullName, fullSurname})
        const author = await UserModel.findById(id);
        await PostModel.updateMany({'author._id': id}, {author})
        res.send("updated");
    }

    async login(req, res) {
        try {
            const {login, password} = req.body
            const user = await UserModel.findOne({login})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${login} не найден`})
            }
            if (user.password != password) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            return res.json({user})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await UserModel.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }

    async follow(req, res) {
        try {
            const { userId, followedUserId } = req.body;
            const user = await UserModel.findById(followedUserId);
            console.log(userId)
            console.log(followedUserId)
            if (user.subscribers.find(e => e == userId)) {
                user.subscribers = user.subscribers.filter(user => user != userId)
                res.json({message: "Отписался"})
            } else {
                user.subscribers.push(userId);
                res.json({message: "Подписался"})
            }
            await user.save()
        } catch (e) {
            console.log(e)
            res.status(500).send('Ошибка')
        }
    }
}

module.exports = new authController()