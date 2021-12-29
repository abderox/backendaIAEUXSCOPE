const res = require("express/lib/response");

const mongoose = require('mongoose');
const connectDB = async () =>
{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected ');
}

module.exports = connectDB;