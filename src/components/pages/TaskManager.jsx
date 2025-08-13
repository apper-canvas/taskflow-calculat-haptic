import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import TaskHeader from "@/components/organisms/TaskHeader";
import Sidebar from "@/components/organisms/Sidebar";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const TaskManager = () => {
  const location = useLocation();
  const { categoryId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  // Determine filter type based on route
  const getFilterType = () => {
if (location.pathname === "/today") return "today";
    if (location.pathname === "/overdue") return "overdue"; 
    if (location.pathname === "/completed") return "completed";
    if (categoryId) return "category";
    return "all";
  };

  // Hooks for data fetching
const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    createTask, 
    updateTask, 
    deleteTask,
    refetch: refetchTasks 
  } = useTasks(getFilterType(), categoryId);

  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories 
  } = useCategories();

  // Calculate stats for sidebar
  const [stats, setStats] = useState({
    todayCount: 0,
    overdueCount: 0,
    completedCount: 0
  });

useEffect(() => {
    const calculateStats = async () => {
      try {
        // These would normally come from service calls, but we'll calculate from current tasks
        const today = new Date().toISOString().split('T')[0];
        const allTasks = tasks; // This might not be all tasks if filtered, but for demo purposes
        
        const todayTasks = allTasks.filter(task => {
          const dueDate = task.due_date_c || task.dueDate;
          const completed = task.completed_c !== undefined ? task.completed_c : task.completed;
          return dueDate === today && !completed;
        });
        const overdueTasks = allTasks.filter(task => {
          const dueDate = task.due_date_c || task.dueDate;
          const completed = task.completed_c !== undefined ? task.completed_c : task.completed;
          return dueDate && dueDate < today && !completed;
        });
        const completedTasks = allTasks.filter(task => 
          task.completed_c !== undefined ? task.completed_c : task.completed
        );

        setStats({
          todayCount: todayTasks.length,
          overdueCount: overdueTasks.length,
          completedCount: completedTasks.length
        });
      } catch (error) {
        console.error("Error calculating stats:", error);
      }
    };

    calculateStats();
  }, [tasks]);

  // Event handlers
  const handleCreateTask = (taskData = null) => {
    setSelectedTask(taskData);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalMode("edit");
    setIsModalOpen(true);
  };

const handleModalSubmit = async (taskData) => {
    if (modalMode === "create") {
      await createTask(taskData);
    } else {
      await updateTask(selectedTask.Id, taskData);
    }
    refetchCategories(); // Update category counts
  };

const handleTaskUpdate = async (taskId, updates) => {
    await updateTask(taskId, updates);
    refetchCategories(); // Update category counts
  };

  const handleTaskDelete = async (taskId) => {
    await deleteTask(taskId);
    refetchCategories(); // Update category counts
  };
const handleCreateCategory = () => {
    // For demo purposes, we'll just show a simple alert
    // In a real app, this would open a category creation modal
    alert("Category creation feature would be implemented here");
  };

  // Loading and error states
  const isLoading = tasksLoading || categoriesLoading;
  const error = tasksError || categoriesError;

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-80 border-r border-gray-200">
          <Loading />
        </div>
        <div className="flex-1">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-80 border-r border-gray-200 p-6">
          <Error message={categoriesError} onRetry={refetchCategories} />
        </div>
        <div className="flex-1 p-6">
          <Error message={error} onRetry={refetchTasks} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <Sidebar
          categories={categories}
          todayCount={stats.todayCount}
          overdueCount={stats.overdueCount}
          completedCount={stats.completedCount}
          onCreateCategory={handleCreateCategory}
          className="h-full"
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 z-50"
            >
              <Sidebar
                categories={categories}
                todayCount={stats.todayCount}
                overdueCount={stats.overdueCount}
                completedCount={stats.completedCount}
                onCreateCategory={handleCreateCategory}
                className="h-full shadow-xl"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <TaskHeader
          tasks={tasks}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateTask={handleCreateTask}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            {/* Quick Add Task - Only show on main views, not completed */}
            {location.pathname !== "/completed" && (
              <QuickAddTask
                onTaskCreate={createTask}
                categories={categories}
              />
            )}

            {/* Task List */}
            <TaskList
              tasks={tasks}
              categories={categories}
              onUpdateTask={handleTaskUpdate}
              onDeleteTask={handleTaskDelete}
              onCreateTask={handleCreateTask}
              searchQuery={searchQuery}
              showCompleted={location.pathname === "/completed"}
title={(() => {
                if (location.pathname === "/today") return "Today's Tasks";
                if (location.pathname === "/overdue") return "Overdue Tasks";
                if (location.pathname === "/completed") return "Completed Tasks";
                if (categoryId) {
                  const category = categories.find(cat => cat.Id === parseInt(categoryId));
                  return category?.name || "Category";
                }
                return "All Tasks";
              })()}
            />
          </div>
        </div>
      </div>

{/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={selectedTask}
        categories={categories}
        mode={modalMode}
      />
    </div>
  );
};

export default TaskManager;