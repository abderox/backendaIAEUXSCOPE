const express = require('express');
const userController = require('../controllers/users');
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
router.post('/register',upload.single('personImage'),userController.register)
router.get('/test',userController.get)
router.get('/profile/:id',checkAuth,userController.get_profile)
router.post('/login', userController.login)
module.exports = router;