const { Schema } = require('mongoose');

const UserSchema = new Schema({
    fullName: {type: String, required: true},
    fullSurname: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true},
    subscribers: []
});

const PostSchema = new Schema({
    postData: String,
    postLikes: [UserSchema],
    date: {
        type: Date,
        default: Date.now
    },
    author: UserSchema
});

module.exports = {
    UserSchema,
    PostSchema
};