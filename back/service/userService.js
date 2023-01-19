const { UserModel } = require('../Models')

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({login});
        if (candidate) {
            throw new Error(`Пользователь с логином ${login} уже существует`);
        }
        const user = await UserModel.create({login, password});
    }
}

module.exports = new UserService();