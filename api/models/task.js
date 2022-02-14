// require the library
const mongoose = require('mongoose');

// creating Schema for Tasks
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
    
});

taskSchema.set('timestamps', true);
const Task = mongoose.model('todo', taskSchema);

// exporting the Schema
module.exports = Task;