const  express = require('express');
const app = express();
const userRoutes = require('./api/routes/users');
const personRoutes = require('./api/routes/persons');
const todoRoutes = require('./api/routes/todo');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
try {
    dotenv=require('dotenv');
 } catch (error) {
     console.log('disabled dotenv problem');
 }

 dotenv.config({
     path:'./config/config.env'
 });

const url = process.env.MONGO_URI;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })
    app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
// choose clients ...
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", 
    "Origin; X-Requested-With, Content-Type, Accept, Authorization");
    if (res.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST,PATCH, DELE, GET');
    return res.status(200).json({});
    }
    next();
})
//routes  .... 
app.use('/users', userRoutes );
app.use('/persons', personRoutes );
app.use('/todo', todoRoutes );

//errors handling ....
app.use((req,res, next) =>{
    const error = new Error('Not found ');
    error.status= 404;
    next(error);
})
app.use((error,req,res, next) =>{
   res.status(error.status || 500)
   .json({
       error : {
           message : error.message
       }
   })
})
module.exports =app;