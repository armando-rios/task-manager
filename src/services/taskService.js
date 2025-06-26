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
    return response.newTask
  },

  // TODO: Agregar update y delete cuando estén disponibles en el backend
}
