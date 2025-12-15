import expressAsyncHandler from 'express-async-handler';
import Todos from '../models/todoModel.js'


// desc get all
// router get/api/todos
//access public


export const getAllTodo = expressAsyncHandler(async (req, res) => {
  const todos = await Todos.find();

  // if (!todos || todos.length === 0) {
  //   res.status(404);
  //   throw new Error('No todos found');
  // }

  res.status(200).json({
    success: true,
    count: todos.length,
    data: todos,
  });
});



// desc Add todo
// router post/api/todos
//access public

export const addTodo = expressAsyncHandler(async (req, res) => {
  const { task, date, completed } = req.body;

  // Validation
  if (!task || !date) {
    res.status(400);
    throw new Error('Task and date are required');
  }

  // Create todo
  const todo = await Todos.create({
    task,
    date,
    completed: completed ?? false, // safe default
  });

  res.status(201).json({
    success: true,
    message: 'Todo added successfully',
    todo,
  });
});

// desc update todo
// router put/api/todos
//access public

export const updateTodo = expressAsyncHandler(async (req, res) => {
  //   res.send('updated....');

  const { id } = req.params;
  const updatedTodo = await Todos.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTodo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  res.status(200).json({
    success: true,
    message: 'Todo updated successfully',
    data:updatedTodo,
  });
});


// desc delete todo
// router delete/api/todos
//access public

export const deleteTodo = expressAsyncHandler(async (req, res) => {
  //   res.send('deleted............');

  const deletedTodo = await Todos.findByIdAndDelete(req.params.id);
  console.log(deletedTodo);

  if (!deletedTodo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  res.status(200).json({
    success: true,
    message: 'Todo deleted successfully',
    id:req.params.id
  });
});
