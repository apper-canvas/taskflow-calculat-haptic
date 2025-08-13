import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const TaskList = ({ 
  tasks, 
  categories, 
  onUpdateTask, 
  onDeleteTask, 
  onCreateTask,
  searchQuery = "",
  showCompleted = true,
  title = "All Tasks"
}) => {
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Filter tasks based on search query and completion status
  const visibleTasks = useMemo(() => {
let filtered = tasks;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task => 
        (task.title_c || task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description_c || task.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(task => !(task.completed_c !== undefined ? task.completed_c : task.completed));
    }
    
    // Sort tasks: incomplete first, then by priority, then by due date
    return filtered.sort((a, b) => {
      const aCompleted = a.completed_c !== undefined ? a.completed_c : a.completed;
      const bCompleted = b.completed_c !== undefined ? b.completed_c : b.completed;
      
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      
      // Priority order: high -> medium -> low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = a.priority_c || a.priority || 'medium';
      const bPriority = b.priority_c || b.priority || 'medium';
      const priorityDiff = (priorityOrder[bPriority] || 0) - (priorityOrder[aPriority] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Sort by due date (tasks with due dates first, then by date)
      const aDueDate = a.due_date_c || a.dueDate;
      const bDueDate = b.due_date_c || b.dueDate;
      if (aDueDate && !bDueDate) return -1;
      if (!aDueDate && bDueDate) return 1;
      if (aDueDate && bDueDate) {
        return new Date(aDueDate) - new Date(bDueDate);
      }
      
      // Finally sort by creation date (newest first)
      const aCreatedAt = a.created_at_c || a.createdAt;
      const bCreatedAt = b.created_at_c || b.createdAt;
      return new Date(bCreatedAt) - new Date(aCreatedAt);
    });
  }, [tasks, searchQuery, showCompleted]);

  useEffect(() => {
    setFilteredTasks(visibleTasks);
  }, [visibleTasks]);

const getCategoryForTask = (task) => {
    const categoryId = task.category_id_c || task.categoryId;
    return categories.find(cat => cat.Id === categoryId);
  };

  const getEmptyStateProps = () => {
    if (searchQuery) {
      return {
        title: "No matching tasks found",
        description: "Try adjusting your search terms or check different categories",
        icon: "Search",
        actionLabel: "Clear Search",
        onAction: () => window.location.href = "/"
      };
    }
    
    if (title === "Today's Tasks") {
      return {
        title: "No tasks for today",
        description: "You're all caught up! Enjoy your productive day.",
        icon: "Calendar",
        actionLabel: "Create Task",
        onAction: onCreateTask
      };
    }
    
    if (title === "Overdue Tasks") {
      return {
        title: "No overdue tasks",
        description: "Great job staying on top of your deadlines!",
        icon: "CheckCircle",
        actionLabel: "View All Tasks",
        onAction: () => window.location.href = "/"
      };
    }
    
    if (title === "Completed Tasks") {
      return {
        title: "No completed tasks yet",
        description: "Completed tasks will appear here. Start checking off those to-dos!",
        icon: "Trophy",
        actionLabel: "View All Tasks",
        onAction: () => window.location.href = "/"
      };
    }
    
    return {
      title: "No tasks found",
      description: "Get started by creating your first task and organize your productivity",
      icon: "CheckSquare",
      actionLabel: "Create Task",
      onAction: onCreateTask
    };
  };

  if (filteredTasks.length === 0) {
    return <Empty {...getEmptyStateProps()} />;
  }

  const completedTasks = filteredTasks.filter(task => task.completed);
  const incompleteTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {incompleteTasks.map((task, index) => (
              <motion.div
key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group"
              >
                <TaskCard
                  task={task}
                  category={getCategoryForTask(task)}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && showCompleted && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 pt-6 border-t border-gray-200">
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-accent-500" />
            <h3 className="font-medium text-gray-600 font-display">
              Completed ({completedTasks.length})
            </h3>
          </div>
          
          <AnimatePresence mode="popLayout">
            {completedTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group"
>
                <TaskCard
                  task={task}
                  category={getCategoryForTask(task)}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskList;