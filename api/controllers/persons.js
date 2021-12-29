const mongoose = require('mongoose')
const Person = require('../models/person');
const User = require('../models/user');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.register = (req, res, next) => {
    console.log(req.file)
    Person.find({ email : req.body.email})
    .exec()
    .then((_result)=>{
        if(_result.length >= 1){
            var base = process.env.PWDD
            console.log(base)
            let  path = 'D:\\Node Project\\AeiuxScope\\'+req.file.path
            try {
                fs.unlinkSync(path)
              } catch(err) {
              }
           console.log(path)
            res.status(200).json({
                result : "not"
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if (err) {
                    return res.status(200).json({result : "error"});
                }else {
                  const person = new Person({
                      _id :  new  mongoose.Types.ObjectId(),
                      email : req.body.email,
                      password : req.body.password,
                      fullName: req.body.fullName,
                      phone : req.body.phone,
                      imagePath :req.file.path.replace("\\", "/")
                  })
    console.log(req.body)
                  person.save()
                  .then((Result) => {
                   
                    const user = new User({
                        _id : new  mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password :  hash,
                        idPerson : Result._id
                    });
                    console.log(person);
                    user.save()
                    .then((result) => {
                        const token =  jwt.sign({
                            email : user.email,
                            userId : user._id
                        },process.env.JWT_KEY,
                        { 
                            expiresIn: "2h"  
                        });
                        res.status(200).json({
                            idPerson: user.idPerson,
                            result :  token
                        });
                    })
                    .catch((error) => {
                        res.status(200).json({result : " error"})
                    })
                  }).catch((error) => {
                      res.status(200).json({result : "error"})
                  })

                }
            })
            
        }
    })
    .catch(err => {
        res.status(200).json({result : "error"})
    });
  
}
exports.get_profile = (req, res) => {
    const id = req.params.id;
    Person.findById(id)
    .exec()
    .then(document => {
        if (document) {
            res.status(200).json({
                email : document.email,
                fullName : document.fullName,
                phone : document.phone,
                imagePath : document.imagePath
            })
        } else {
            res.status(200).json({message : "error"})
        }
        
    })
    .catch((err) => {
        res.status(200).json({error : "error" })
    });
}
exports.get = (req, res)=>{
    res.status(200).json({
        result : "its work"
    })
}
exports.tt= (req, res) => {
    res.status(200).json({
        result : req.body.name
    })
}