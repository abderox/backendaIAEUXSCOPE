const express = require('express');
const personController = require('../controllers/persons');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const multer = require('multer')
const  storage =  multer.diskStorage({
    destination : function (req, file, cb){
        console.log('work')
    cb(null,'./uploads/');
    },
    filename : function (req, file, cb){
        var str = file.mimetype.toString();
      cb(null,  Date.now().toString() +'.jpg');
    }
});
const fileFilter= (req, file, cb) => {
// reject file 
if (file.mimetype === 'image/jpeg' ) {
    cb(null,true);
}else{
    cb(null,false);
}
};
const  upload = multer({
    storage : storage,
    limits : { fileSize : 1024 * 1024*5}
})
// 
router.post('/register',upload.single('personImage'),personController.register)
router.post('/tt',upload.single('personImage'),personController.tt)
router.get('/test',personController.get)

router.get('/profile/:id',checkAuth,personController.get_profile)
module.exports = router;