import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay();
    return tasks.map(task => ({ ...task }));
  },

  async getById(id) {
    await delay();
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay();
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    tasks[index] = { ...tasks[index], ...updates };
    
    // Set completedAt when task is completed
    if (updates.completed === true && !tasks[index].completedAt) {
      tasks[index].completedAt = new Date().toISOString();
    } else if (updates.completed === false) {
      tasks[index].completedAt = null;
    }
    
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return false;
    
    tasks.splice(index, 1);
    return true;
  },

  async getByCategory(categoryId) {
    await delay();
    return tasks
      .filter(task => task.categoryId === parseInt(categoryId))
      .map(task => ({ ...task }));
  },

  async getTodayTasks() {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    return tasks
      .filter(task => task.dueDate === today && !task.completed)
      .map(task => ({ ...task }));
  },

  async getOverdueTasks() {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    return tasks
      .filter(task => task.dueDate && task.dueDate < today && !task.completed)
      .map(task => ({ ...task }));
  },

  async getCompletedTasks() {
    await delay();
    return tasks
      .filter(task => task.completed)
      .map(task => ({ ...task }))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  },

  async bulkDelete(ids) {
    await delay();
    const deletedTasks = [];
    
    ids.forEach(id => {
      const index = tasks.findIndex(t => t.Id === parseInt(id));
      if (index !== -1) {
        deletedTasks.push(tasks.splice(index, 1)[0]);
      }
    });
    
    return deletedTasks;
  }
};