import categoriesData from "@/services/mockData/categories.json";
import { taskService } from "./taskService.js";

let categories = [...categoriesData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay();
    // Update task counts dynamically
    const tasks = await taskService.getAll();
    return categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => task.categoryId === category.Id && !task.completed).length
    }));
  },

  async getById(id) {
    await delay();
    const category = categories.find(c => c.Id === parseInt(id));
    if (!category) return null;
    
    // Update task count
    const tasks = await taskService.getAll();
    return {
      ...category,
      taskCount: tasks.filter(task => task.categoryId === category.Id && !task.completed).length
    };
  },

  async create(categoryData) {
    await delay();
    const newCategory = {
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      ...categoryData,
      taskCount: 0,
      createdAt: new Date().toISOString()
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await delay();
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    categories[index] = { ...categories[index], ...updates };
    
    // Update task count
    const tasks = await taskService.getAll();
    categories[index].taskCount = tasks.filter(task => task.categoryId === categories[index].Id && !task.completed).length;
    
    return { ...categories[index] };
  },

  async delete(id) {
    await delay();
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return false;
    
    // Check if category has tasks
    const tasks = await taskService.getAll();
    const categoryTasks = tasks.filter(task => task.categoryId === parseInt(id));
    
    if (categoryTasks.length > 0) {
      throw new Error("Cannot delete category with existing tasks");
    }
    
    categories.splice(index, 1);
    return true;
  }
};