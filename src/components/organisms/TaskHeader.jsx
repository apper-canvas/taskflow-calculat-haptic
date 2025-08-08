import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useParams } from "react-router-dom";
import ProgressRing from "@/components/molecules/ProgressRing";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskHeader = ({ 
  tasks, 
  categories, 
  searchQuery, 
  onSearchChange, 
  onCreateTask,
  onToggleSidebar 
}) => {
  const location = useLocation();
  const { categoryId } = useParams();

  const { title, subtitle, stats } = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    if (location.pathname === "/today") {
      return {
        title: "Today's Tasks",
        subtitle: `${tasks.length} tasks scheduled for today`,
        stats: { completed: completedTasks, total: totalTasks, progress }
      };
    }

    if (location.pathname === "/overdue") {
      return {
        title: "Overdue Tasks",
        subtitle: `${tasks.length} tasks need immediate attention`,
        stats: { completed: completedTasks, total: totalTasks, progress }
      };
    }

    if (location.pathname === "/completed") {
      return {
        title: "Completed Tasks",
        subtitle: `${tasks.length} tasks completed successfully`,
        stats: { completed: completedTasks, total: totalTasks, progress: 100 }
      };
    }

    if (categoryId) {
      const category = categories.find(cat => cat.Id === parseInt(categoryId));
      return {
        title: category?.name || "Category",
        subtitle: `${tasks.length} tasks in this category`,
        stats: { completed: completedTasks, total: totalTasks, progress }
      };
    }

    return {
      title: "All Tasks",
      subtitle: `${totalTasks} total tasks • ${completedTasks} completed`,
      stats: { completed: completedTasks, total: totalTasks, progress }
    };
  }, [tasks, categories, location.pathname, categoryId]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden mr-3 p-2"
        >
          <ApperIcon name="Menu" className="w-5 h-5" />
        </Button>

        {/* Title Section */}
        <div className="flex items-center space-x-6 flex-1">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {title}
            </h1>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>

          {/* Progress Ring */}
          <div className="hidden md:flex items-center space-x-4">
            <ProgressRing 
              progress={stats.progress} 
              size={64} 
              strokeWidth={4}
            />
            <div className="text-sm">
              <div className="font-semibold text-gray-900">
                {stats.completed} / {stats.total}
              </div>
              <div className="text-gray-500">completed</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onCreateTask}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl ml-4"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <SearchBar
          placeholder="Search tasks..."
          onSearch={onSearchChange}
          className="max-w-md"
        />
      </div>
    </motion.div>
  );
};

export default TaskHeader;