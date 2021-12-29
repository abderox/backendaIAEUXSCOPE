const express = require('express');
const Todo = require('../models/Todo');


// desc    Create new todo task
// method POST
exports.createTodo = async (req, res, next) => {
    try {
        const toDo = await Todo.create({ title: req.body.title, description: req.body.description, user: req.user.id});
        if(!toDo) {
            return res.status(400).json({
                success: false,
                msg: 'Something went wrong'
            });
        }

        res.status(200).json({
            success: true,
            todo: toDo,
            msg: 'Successfully created.'
        });
    } catch (error) {
        next(error);
    }
}

