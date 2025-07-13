import { apiRequest } from './api.js'
import { ENDPOINTS } from '../utils/constants.js'

export const taskService = {
  /**
   * Get all tasks
   */
  async getAll() {
    const response = await apiRequest(ENDPOINTS.TASKS)
    return response.tasks
  },

  /**
   * Create a new task
   */
  async create(taskData) {
    const response = await apiRequest(ENDPOINTS.TASKS, {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
    return response.task
  },

  /**
   * Update a task
   */
  async update(id, taskData) {
    const response = await apiRequest(ENDPOINTS.TASKS, {
      method: 'PUT',
      body: JSON.stringify({ id, ...taskData }),
    })
    return response.task
  },

  /**
   * Delete a task
   */
  async delete(id) {
    const response = await apiRequest(ENDPOINTS.TASKS, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    return response.task
  },
}
