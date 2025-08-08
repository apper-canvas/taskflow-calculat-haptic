import { useState, useEffect } from "react";
import { categoryService } from "@/services/api/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      setError("");
      const newCategory = await categoryService.create(categoryData);
      await loadCategories(); // Refresh the list
      return newCategory;
    } catch (err) {
      setError("Failed to create category. Please try again.");
      console.error("Error creating category:", err);
      throw err;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      setError("");
      const updatedCategory = await categoryService.update(id, updates);
      await loadCategories(); // Refresh the list
      return updatedCategory;
    } catch (err) {
      setError("Failed to update category. Please try again.");
      console.error("Error updating category:", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      setError("");
      await categoryService.delete(id);
      await loadCategories(); // Refresh the list
    } catch (err) {
      setError(err.message || "Failed to delete category. Please try again.");
      console.error("Error deleting category:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: loadCategories
  };
};