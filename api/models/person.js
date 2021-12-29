const mongoose = require('mongoose');
const personShema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : {type: 'string', required: true, unique: true,
        match :  /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    },
    password : {type: 'string', required: true},
    fullName : {type: 'string', required: true},
   imagePath : {type: 'string'},
    phone : {type: Number, required: true}
});
module.exports =mongoose.model('Person', personShema);