import { apiRequest } from './api.js'
import { ENDPOINTS } from '../utils/constants.js'

export const projectService = {
  /**
   * Get all projects
   */
  async getAll() {
    const response = await apiRequest(ENDPOINTS.PROJECTS)
    return response.projects
  },

  /**
   * Create a new project
   */
  async create(projectData) {
    const response = await apiRequest(ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
    return response.project
  },

  /**
   * Update a project
   */
  async update(id, projectData) {
    const response = await apiRequest(ENDPOINTS.PROJECTS, {
      method: 'PUT',
      body: JSON.stringify({ id, ...projectData }),
    })
    return response.project
  },

  /**
   * Delete a project
   */
  async delete(id) {
    const response = await apiRequest(ENDPOINTS.PROJECTS, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    return response.project
  },
}
