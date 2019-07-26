const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        trim: true,
        required : true,
    },
    email : {
        type : String,
        trim: true,
        unique : true,
        match : /^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/,
        required : true
    },
    password : {
        type : String,
        required: true,
        trim : true,
        select : false,
        minlength : 8
    },
    image : {
        type : String
    }
}, { timestamps : true });

module.exports = mongoose.model('User', UserSchema);