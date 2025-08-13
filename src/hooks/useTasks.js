import { useEffect, useState } from "react";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

export const useTasks = (filter = "all", categoryId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
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

      if (!data || data.length === 0) {
        setTasks([]);
      } else {
        setTasks(data);
      }
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setError("");
      const newTask = await taskService.create(taskData);
      if (newTask) {
        toast.success("Task created successfully!");
        await loadTasks(); // Refresh the list
        return newTask;
      }
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error("Error creating task:", err);
      toast.error("Failed to create task. Please try again.");
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      setError("");
      const updatedTask = await taskService.update(id, updates);
      if (updatedTask) {
        toast.success("Task updated successfully!");
        await loadTasks(); // Refresh the list
        return updatedTask;
      }
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", err);
      toast.error("Failed to update task. Please try again.");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");
      const success = await taskService.delete(id);
      if (success) {
        toast.success("Task deleted successfully!");
        await loadTasks(); // Refresh the list
      }
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task. Please try again.");
      throw err;
    }
  };

  const bulkDeleteTasks = async (ids) => {
    try {
      setError("");
      const deletedTasks = await taskService.bulkDelete(ids);
      if (deletedTasks.length > 0) {
        toast.success(`${deletedTasks.length} tasks deleted successfully!`);
        await loadTasks(); // Refresh the list
      }
    } catch (err) {
      setError("Failed to delete tasks. Please try again.");
      console.error("Error bulk deleting tasks:", err);
      toast.error("Failed to delete tasks. Please try again.");
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
};
};