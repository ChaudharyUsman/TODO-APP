const express = require('express');
const router = express.Router();
const {FetchTask, CreateTask, UpdateTask, deleteTask} = require('../controller/todoController');
// GET all
router.get('/',FetchTask);
// POST
router.post('/', CreateTask);
// PUT Use ID
router.put('/:id', UpdateTask);

// DELETE Use ID
router.delete('/:id', deleteTask);

module.exports = router;