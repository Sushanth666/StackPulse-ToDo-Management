import api from './api';

/**
 * Todo Service for JSONPlaceholder CRUD REST API operations
 * Endpoints:
 * - GET    /todos       -> Fetch all todos
 * - GET    /todos/:id   -> Fetch single todo by ID
 * - POST   /todos       -> Create a new todo
 * - PUT    /todos/:id   -> Replace/Update existing todo
 * - PATCH  /todos/:id   -> Partially update existing todo
 * - DELETE /todos/:id   -> Delete todo by ID
 */

export const todoService = {
  /**
   * Fetch all todos or filtered by query params (e.g. userId, _limit, _page)
   * @param {Object} params - optional query parameters
   * @returns {Promise<Array>} List of todo items
   */
  async getTodos(params = {}) {
    const response = await api.get('/todos', { params });
    return response.data;
  },

  /**
   * Fetch a single todo by its ID
   * @param {number|string} id - Todo ID
   * @returns {Promise<Object>} Todo item
   */
  async getTodoById(id) {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  /**
   * Create a new todo (POST request to /todos)
   * @param {Object} todoData - { title: string, completed: boolean, userId: number }
   * @returns {Promise<Object>} Created todo object with assigned ID
   */
  async createTodo(todoData) {
    const payload = {
      title: todoData.title?.trim(),
      completed: Boolean(todoData.completed),
      userId: Number(todoData.userId) || 1,
    };
    const response = await api.post('/todos', payload);
    return response.data;
  },

  /**
   * Update an entire todo or partial properties (PUT or PATCH request)
   * @param {number|string} id - Todo ID
   * @param {Object} updates - Updated properties { title, completed, userId }
   * @param {boolean} isPartial - If true uses PATCH, otherwise PUT
   * @returns {Promise<Object>} Updated todo object
   */
  async updateTodo(id, updates, isPartial = false) {
    const method = isPartial ? 'patch' : 'put';
    // When updating mock IDs (e.g., > 200 created locally), JSONPlaceholder returns 404 or 500 for IDs it doesn't know.
    // We handle this gracefully.
    try {
      const response = await api[method](`/todos/${id}`, updates);
      return response.data;
    } catch (err) {
      // If it's a locally created item that doesn't exist on JSONPlaceholder server,
      // simulate standard successful response format
      if (Number(id) > 200) {
        return { id: Number(id), ...updates };
      }
      throw err;
    }
  },

  /**
   * Delete a todo by ID (DELETE request to /todos/:id)
   * @param {number|string} id - Todo ID
   * @returns {Promise<boolean>} True if successful
   */
  async deleteTodo(id) {
    try {
      await api.delete(`/todos/${id}`);
      return true;
    } catch (err) {
      if (Number(id) > 200) {
        return true;
      }
      throw err;
    }
  },
};

export default todoService;
