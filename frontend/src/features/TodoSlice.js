import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import  TodoService  from './TodoService';

const initialState = {
  todos: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};
export const addTodo = createAsyncThunk(
  'todos/add',
  async (formData, thunkAPI) => {
    try {
      const response = await TodoService.createTodo(formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Fill all fields'
      );
    }
  }
);

export const getAllTodo = createAsyncThunk(
  'todos/getall',
  async (_, thunkAPI) => {
    try {
      const response = await TodoService.getallTodos();
      console.log('Todos :', response);
      return response;
    } catch (error) {
      console.error('Error getting todo:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get all todo'
      );
    }
  }
);
export const updateTodo = createAsyncThunk(
  'todos/update',
  async ({ id, ...updateData }, thunkAPI) => {
    try {
      const response = await TodoService.updateTodo(id, updateData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update'
      );
    }
  }
);
export const deleteTodo = createAsyncThunk(
  'todos/delete',
  async ( id , thunkAPI) => {
    try {
      const response = await TodoService.deleteTodo(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update'
      );
    }
  }
);


const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },

  // For async Thunks (addTodo, deleteTodo, updateTodo…)
  extraReducers: (builder) => {
    builder

      // addTodo
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // getAllTodo
      .addCase(getAllTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = action.payload;
      })
      .addCase(getAllTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // updateTodo
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.todos = state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
      })

      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // deleteTodo
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.todos = state.todos.filter((todo) => todo._id !== action.payload.id);
      })

      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = todoSlice.actions;
export default todoSlice.reducer;
