import { useState, useEffect } from "react";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      
      if (!data || data.length === 0) {
        setCategories([]);
      } else {
        setCategories(data);
      }
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error loading categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      setError("");
      const newCategory = await categoryService.create(categoryData);
      if (newCategory) {
        toast.success("Category created successfully!");
        await loadCategories(); // Refresh the list
        return newCategory;
      }
    } catch (err) {
      setError("Failed to create category. Please try again.");
      console.error("Error creating category:", err);
      toast.error("Failed to create category. Please try again.");
      throw err;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      setError("");
      const updatedCategory = await categoryService.update(id, updates);
      if (updatedCategory) {
        toast.success("Category updated successfully!");
        await loadCategories(); // Refresh the list
        return updatedCategory;
      }
    } catch (err) {
      setError("Failed to update category. Please try again.");
      console.error("Error updating category:", err);
      toast.error("Failed to update category. Please try again.");
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      setError("");
      const success = await categoryService.delete(id);
      if (success) {
        toast.success("Category deleted successfully!");
        await loadCategories(); // Refresh the list
      }
    } catch (err) {
      setError(err.message || "Failed to delete category. Please try again.");
      console.error("Error deleting category:", err);
      toast.error(err.message || "Failed to delete category. Please try again.");
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