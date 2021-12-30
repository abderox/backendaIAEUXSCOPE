const http = require("http")
const app = require('./App')
try {
    dotenv=require('dotenv');
 } catch (error) {
     console.log('disabled dotenv problem');
 }

 dotenv.config({
     path:'./config/config.env'
 });
const PORT =  1235;
const server = http.createServer(app);
server.listen(PORT);

