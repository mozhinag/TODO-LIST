import axios from 'axios'

const API_URL = '/api/todos/';

const createTodo = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data;
};

const getallTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};
const updateTodo = async (id, updateData) => {
  const response = await axios.put(`${API_URL}${id}`, updateData);
  return response.data.data;
};

const deleteTodo = async (id) => {
  const response = await axios.delete(`${API_URL}${id}`);
  return response.data;
};


const TodoService = {
  createTodo,
  getallTodos,
  updateTodo,
  deleteTodo,
};

export default TodoService
