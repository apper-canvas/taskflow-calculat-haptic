import { toast } from "react-toastify";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_id_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_id_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('task_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const record = {
        Name: taskData.title_c || taskData.title || '',
        title_c: taskData.title_c || taskData.title || '',
        description_c: taskData.description_c || taskData.description || '',
        priority_c: taskData.priority_c || taskData.priority || 'medium',
        due_date_c: taskData.due_date_c || taskData.dueDate || null,
        completed_c: taskData.completed_c !== undefined ? taskData.completed_c : false,
        created_at_c: new Date().toISOString(),
        category_id_c: parseInt(taskData.category_id_c || taskData.categoryId || 1)
      };

      const params = {
        records: [record]
      };
      
      const response = await apperClient.createRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
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

      if (updates.title_c !== undefined || updates.title !== undefined) {
        record.title_c = updates.title_c || updates.title;
        record.Name = updates.title_c || updates.title;
      }
      if (updates.description_c !== undefined || updates.description !== undefined) {
        record.description_c = updates.description_c || updates.description;
      }
      if (updates.priority_c !== undefined || updates.priority !== undefined) {
        record.priority_c = updates.priority_c || updates.priority;
      }
      if (updates.due_date_c !== undefined || updates.dueDate !== undefined) {
        record.due_date_c = updates.due_date_c || updates.dueDate;
      }
      if (updates.completed_c !== undefined || updates.completed !== undefined) {
        record.completed_c = updates.completed_c !== undefined ? updates.completed_c : updates.completed;
        if (record.completed_c && !updates.completed_at_c) {
          record.completed_at_c = new Date().toISOString();
        } else if (!record.completed_c) {
          record.completed_at_c = null;
        }
      }
      if (updates.category_id_c !== undefined || updates.categoryId !== undefined) {
        record.category_id_c = parseInt(updates.category_id_c || updates.categoryId);
      }

      const params = {
        records: [record]
      };
      
      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update tasks ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async getByCategory(categoryId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_id_c" } }
        ],
        where: [
          {
            FieldName: "category_id_c",
            Operator: "EqualTo",
            Values: [parseInt(categoryId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getTodayTasks() {
    try {
      const apperClient = getApperClient();
      const today = new Date().toISOString().split('T')[0];
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_id_c" } }
        ],
        where: [
          {
            FieldName: "due_date_c",
            Operator: "EqualTo",
            Values: [today]
          },
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [false]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getOverdueTasks() {
    try {
      const apperClient = getApperClient();
      const today = new Date().toISOString().split('T')[0];
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_id_c" } }
        ],
        where: [
          {
            FieldName: "due_date_c",
            Operator: "LessThan",
            Values: [today]
          },
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [false]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching overdue tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getCompletedTasks() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_id_c" } }
        ],
        where: [
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          {
            fieldName: "completed_at_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching completed tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async bulkDelete(ids) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };
      
      const response = await apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.map(result => result.data);
      }
      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk deleting tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};