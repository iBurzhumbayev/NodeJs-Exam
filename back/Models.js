const mongoose = require('mongoose');
const { UserSchema, PostSchema } = require('./schemas');

const UserModel = mongoose.model('VShageUser', UserSchema);
const PostModel = mongoose.model('VShagePost', PostSchema);

module.exports = {
    UserModel,
    PostModel
};