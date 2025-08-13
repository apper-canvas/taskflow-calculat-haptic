import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "task_count_c" } },
          { field: { Name: "created_at_c" } }
        ],
        aggregators: [
          {
            id: 'TaskCount',
            fields: [
              { field: { Name: "Id" }, Function: 'Count', Alias: 'Count' }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Calculate task counts for each category
      const categories = response.data || [];
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          try {
            // Get task count for this category
            const taskParams = {
              fields: [{ field: { Name: "Id" } }],
              where: [
                {
                  FieldName: "category_id_c",
                  Operator: "EqualTo",
                  Values: [category.Id]
                },
                {
                  FieldName: "completed_c",
                  Operator: "EqualTo",
                  Values: [false]
                }
              ]
            };
            
            const taskResponse = await apperClient.fetchRecords('task_c', taskParams);
            const taskCount = taskResponse.success ? (taskResponse.data || []).length : 0;
            
            return {
              ...category,
              name: category.Name,
              color: category.color_c,
              taskCount: taskCount,
              createdAt: category.created_at_c
            };
          } catch (error) {
            return {
              ...category,
              name: category.Name,
              color: category.color_c,
              taskCount: 0,
              createdAt: category.created_at_c
            };
          }
        })
      );

      return categoriesWithCounts;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "task_count_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('category_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) return null;

      const category = response.data;
      
      // Get task count for this category
      try {
        const taskParams = {
          fields: [{ field: { Name: "Id" } }],
          where: [
            {
              FieldName: "category_id_c",
              Operator: "EqualTo",
              Values: [category.Id]
            },
            {
              FieldName: "completed_c",
              Operator: "EqualTo",
              Values: [false]
            }
          ]
        };
        
        const taskResponse = await apperClient.fetchRecords('task_c', taskParams);
        const taskCount = taskResponse.success ? (taskResponse.data || []).length : 0;
        
        return {
          ...category,
          name: category.Name,
          color: category.color_c,
          taskCount: taskCount,
          createdAt: category.created_at_c
        };
      } catch (error) {
        return {
          ...category,
          name: category.Name,
          color: category.color_c,
          taskCount: 0,
          createdAt: category.created_at_c
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const record = {
        Name: categoryData.name || '',
        color_c: categoryData.color || '#5B47E0',
        task_count_c: 0,
        created_at_c: new Date().toISOString()
      };

      const params = {
        records: [record]
      };
      
      const response = await apperClient.createRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newCategory = successfulRecords[0].data;
          return {
            ...newCategory,
            name: newCategory.Name,
            color: newCategory.color_c,
            taskCount: 0,
            createdAt: newCategory.created_at_c
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields and Id
      const record = {
        Id: parseInt(id)
      };

      if (updates.name !== undefined) {
        record.Name = updates.name;
      }
      if (updates.color !== undefined) {
        record.color_c = updates.color;
      }
      if (updates.task_count_c !== undefined) {
        record.task_count_c = updates.task_count_c;
      }

      const params = {
        records: [record]
      };
      
      const response = await apperClient.updateRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update categories ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedCategory = successfulUpdates[0].data;
          return {
            ...updatedCategory,
            name: updatedCategory.Name,
            color: updatedCategory.color_c,
            taskCount: updatedCategory.task_count_c || 0,
            createdAt: updatedCategory.created_at_c
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      // Check if category has tasks first
      const taskParams = {
        fields: [{ field: { Name: "Id" } }],
        where: [
          {
            FieldName: "category_id_c",
            Operator: "EqualTo",
            Values: [parseInt(id)]
          }
        ]
      };
      
      const taskResponse = await apperClient.fetchRecords('task_c', taskParams);
      
      if (taskResponse.success && taskResponse.data && taskResponse.data.length > 0) {
        throw new Error("Cannot delete category with existing tasks");
      }
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete categories ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
}
  }
};