const mongoose = require('mongoose')
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next)=>{
    User.find({email : req.body.email}).exec()
    .then(users => {
     if (users.length < 1) {
        res.status(200).json({result : 'not'})
     } else {
      bcrypt.compare(req.body.password,users[0].password,(err,result)=>{
          if (err) {
              return    res.status(200).json({result : 'error'})
          }
          if (result){
              const token =  jwt.sign({
                   email : users[0].email,
                   userId : users[0]._id
               },process.env.JWT_KEY,
               { 
                   expiresIn: "2h"
               });

           return   res.status(200).json({
            idPerson : users[0].idPerson,
                 result : token
             })
          }
          res.status(200).json({result : 'not'})
      })
     }
    })
    .catch(err => {
        res.status(200).json({resut : "error"})
    })
}