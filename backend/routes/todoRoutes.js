import express from 'express';
import {
  getAllTodo,
  addTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoControllers.js';
const router = express.Router();

router.route('/').get(getAllTodo).post(addTodo);
router.route('/:id').put(updateTodo).delete(deleteTodo);

export default router;
