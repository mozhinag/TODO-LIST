import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTodo, getAllTodo, updateTodo } from '../features/TodoSlice';
import { MdDelete, MdEdit } from 'react-icons/md';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { todos, isLoading, isError, message } = useSelector(
    (state) => state.todos
  );

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(getAllTodo());
  }, [dispatch]);

  const handleToggle = (todo) => {
    dispatch(
      updateTodo({
        id: todo._id,
        completed: !todo.completed,
      })
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTodo(id));
    }
  };

  const isDueSoon = (date) => {
    const today = new Date();
    const due = new Date(date);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const visibleTodos = showAll ? todos : todos.filter((t) => !t.completed);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {message}</p>;

  return (
    <>
      <div className="heading">My Todo List</div>

      <div className="top-buttons">
        <button onClick={() => navigate('/form')}>Add Task</button>
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Pending Tasks' : 'All Tasks'}
        </button>
      </div>

      <table className="todo-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Task</th>
            <th>Due</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {visibleTodos.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                align="center"
              >
                No tasks found
              </td>
            </tr>
          ) : (
            visibleTodos.map((todo, index) => (
              <tr key={todo._id}>
                <td>{index + 1}</td>
                <td>
                  {todo.task}
                  {!todo.completed && isDueSoon(todo.date) && (
                    <span className="warning"> ⚠ Due soon</span>
                  )}
                </td>
                <td>{new Date(todo.date).toLocaleDateString()}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                  />
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="icon-btn"
                      onClick={() => navigate('/form', { state: { todo } })}
                    >
                      <MdEdit />
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(todo._id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default Dashboard;
