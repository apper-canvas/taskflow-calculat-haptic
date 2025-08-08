import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";

export const useTasks = (filter = "all", categoryId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      let data = [];

      switch (filter) {
        case "today":
          data = await taskService.getTodayTasks();
          break;
        case "overdue":
          data = await taskService.getOverdueTasks();
          break;
        case "completed":
          data = await taskService.getCompletedTasks();
          break;
        case "category":
          if (categoryId) {
            data = await taskService.getByCategory(categoryId);
          } else {
            data = await taskService.getAll();
          }
          break;
        default:
          data = await taskService.getAll();
      }

      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setError("");
      const newTask = await taskService.create(taskData);
      await loadTasks(); // Refresh the list
      return newTask;
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error("Error creating task:", err);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      setError("");
      const updatedTask = await taskService.update(id, updates);
      await loadTasks(); // Refresh the list
      return updatedTask;
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");
      await taskService.delete(id);
      await loadTasks(); // Refresh the list
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const bulkDeleteTasks = async (ids) => {
    try {
      setError("");
      await taskService.bulkDelete(ids);
      await loadTasks(); // Refresh the list
    } catch (err) {
      setError("Failed to delete tasks. Please try again.");
      console.error("Error bulk deleting tasks:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter, categoryId]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    bulkDeleteTasks,
    refetch: loadTasks
  };
};