const mongoose = require('mongoose');
const profileShema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    fullName : {type: 'string', required: true},
   imagePath : {type: 'string'},
    phone : {type: Number, required: true}
});
module.exports =mongoose.model('Profile', profileShema);