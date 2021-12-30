const express = require('express');
const todoController = require('../controllers/todo');
const Todo = require('../models/Todo');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

//   Create new todo task
router.post('/', checkAuth, todoController.createTodo);
// get all todos
router.get('/', checkAuth, todoController.getAllTodos);
// get only finished todos
router.get('/finished', checkAuth, todoController.getAllTodosFinished);
// update a todo
router.put('/:id',todoController.update);
// delete todo
router.delete('/:id', todoController.deleteTodo);


module.exports = router;