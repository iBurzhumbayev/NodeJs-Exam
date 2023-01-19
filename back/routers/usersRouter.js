const express = require('express');
const { UserModel } = require('../Models')
const {getUsers, registration, deleteUser, editUser, login, follow} = require('../controllers/usersController')
const router = express.Router();
const {check} = require('express-validator')

router.get('/', getUsers);

router.delete('/:id', deleteUser);

router.get('/:id', (req, res) => {
    const { id } = req.params
    UserModel.findById(id, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

router.post('/', [
    check('login', 'Логин не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 10 символов').isLength({min: 4, max:10})
], registration);

router.post('/login', login);

router.post('/follow/:id', follow);

router.put("/:id", editUser);

module.exports = router;