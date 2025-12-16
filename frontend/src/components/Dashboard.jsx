import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTodo, getAllTodo, updateTodo } from '../features/TodoSlice';
import {
  MdDelete,
  MdEdit,
  MdChevronLeft,
  MdChevronRight,
  MdAddTask,
} from 'react-icons/md';

const PAGE_SIZE = 5;

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { todos, isLoading, isError, message } = useSelector(
    (state) => state.todos
  );

  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllTodo());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [showAll]);

  const handleToggle = (todo) => {
    dispatch(updateTodo({ id: todo._id, completed: !todo.completed }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTodo(id));
    }
  };

  const isDueSoon = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const filteredTodos = useMemo(
    () => (showAll ? todos : todos.filter((t) => !t.completed)),
    [todos, showAll]
  );

  const totalPages = Math.ceil(filteredTodos.length / PAGE_SIZE);

  const paginatedTodos = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTodos.slice(start, start + PAGE_SIZE);
  }, [filteredTodos, currentPage]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {message}</p>;

  return (
    <>
      <div className="heading">My Todo List</div>
      <div className="top-buttons">
        <button
          className="primary-btn"
          onClick={() => navigate('/form')}
        >
          <MdAddTask /> Add Task
        </button>

        <button
          className="secondary-btn"
          onClick={() => setShowAll(!showAll)}
        >
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
          {/* pagination */}
          {paginatedTodos.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                align="center"
              >
                No tasks found
              </td>
            </tr>
          ) : (
            paginatedTodos.map((todo, index) => (
              <tr
                key={todo._id}
                className={todo.completed ? 'done' : ''}
              >
                <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                <td>
                  {todo.task}
                  {!todo.completed && isDueSoon(todo.date) && (
                    <span className="warning"> ⏰ Due soon</span>
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
                      className="icon-btn edit"
                      title="Edit"
                      onClick={() => navigate('/form', { state: { todo } })}
                    >
                      <MdEdit />
                    </button>

                    <button
                      className="icon-btn delete"
                      title="Delete"
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
      {/* 🔹 Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-nav"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            title="Previous"
          >
            <MdChevronLeft size={22} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="page-nav"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            title="Next"
          >
            <MdChevronRight size={22} />
          </button>
        </div>
      )}

    </>
  );
}

export default Dashboard;
