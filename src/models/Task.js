export default class Task {
  constructor ({ title, description = "", status = "pending", projectId, priority = "medium", dueDate = null }) {
    this.id = Date.now().toString()
    this.projectId = projectId
    this.title = title
    this.description = description
    this.dueDate = dueDate
    this.status = status
    this.priority = priority
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }
}
