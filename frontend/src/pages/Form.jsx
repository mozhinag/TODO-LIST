import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, updateTodo, reset } from '../features/TodoSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdArrowBackIosNew, MdEdit, MdAdd } from 'react-icons/md';

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isError, message } = useSelector((state) => state.todos);

  const editingTodo = location.state?.todo;

  const [formData, setFormData] = useState({
    task: '',
    date: '',
    completed: false,
  });

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        task: editingTodo.task,
        date: editingTodo.date?.split('T')[0],
        completed: editingTodo.completed,
      });
    }

    return () => {
      dispatch(reset());
    };
  }, [editingTodo, dispatch]);

  useEffect(() => {
    if (isError) {
      alert(message || 'Fill all fields');
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   const action = editingTodo
  //     ? updateTodo({ id: editingTodo._id, ...formData })
  //     : addTodo(formData);

  //   const result = await dispatch(action);

  //   if (addTodo.fulfilled.match(result) || updateTodo.fulfilled.match(result)) {
  //     dispatch(reset());
  //     navigate('/');
  //   }
  // };
const onSubmit = async (e) => {
  e.preventDefault();

  // 🟡 DATE VALIDATION (EDIT-SAFE)
  if (formData.date) {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is changed during edit
    const originalDate = editingTodo ? editingTodo.date?.split('T')[0] : null;

    const isDateChanged = !editingTodo || formData.date !== originalDate;

    if (isDateChanged && selectedDate < today) {
      alert('Due date cannot be in the past');
      return;
    }
  }

  const payload = editingTodo
    ? {
        id: editingTodo._id,
        task: formData.task || editingTodo.task,
        date: formData.date || editingTodo.date,
        completed: formData.completed,
      }
    : formData;

  const result = await dispatch(
    editingTodo ? updateTodo(payload) : addTodo(payload)
  );

  if (addTodo.fulfilled.match(result) || updateTodo.fulfilled.match(result)) {
    dispatch(reset());
    navigate('/');
  }
};

  return (
    <form onSubmit={onSubmit}>
      <div className="heading">{editingTodo ? 'Edit Task' : 'Add Task'}</div>

      <button
        type="button"
        className="small-Button"
        onClick={() => navigate('/')}
      >
        <MdArrowBackIosNew />
      </button>

      <div className="form">
        <div className="form-group">
          <label>Task</label>
          <input
            name="task"
            value={formData.task}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Completed</label>
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={onChange}
          />
        </div>

        <button
          type="submit"
          className="icon-btn"
        >
          {editingTodo ? <MdEdit size={22} /> : <MdAdd size={22} />}
        </button>
      </div>
    </form>
  );
}

export default Form;
