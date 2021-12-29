const mongoose = require('mongoose');
const userShema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : {type: 'string', required: true, unique: true,
        match :  /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    },
    password : {type: 'string', required: true},
    idProfile :{type: mongoose.Schema.Types.ObjectId, ref: 'profile', required: true},
});
module.exports =mongoose.model('User', userShema);