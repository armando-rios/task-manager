export default class Project {
  constructor(name, description = '') {
    this.id = Date.now().toString();
    this.name = name;
    this.description = description;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
