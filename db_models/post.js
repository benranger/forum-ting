const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Post = mongoose.model('msg', postSchema);
module.exports = Post;