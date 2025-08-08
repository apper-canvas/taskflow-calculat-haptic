import { motion } from "framer-motion";
import { NavLink, useParams } from "react-router-dom";
import CategoryItem from "@/components/molecules/CategoryItem";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ categories, todayCount, overdueCount, completedCount, onCreateCategory, className }) => {
  const { categoryId } = useParams();

  const menuItems = [
    {
      label: "All Tasks",
      path: "/",
      icon: "List",
      count: categories.reduce((sum, cat) => sum + cat.taskCount, 0)
    },
    {
      label: "Today",
      path: "/today", 
      icon: "Calendar",
      count: todayCount,
      variant: "warning"
    },
    {
      label: "Overdue",
      path: "/overdue",
      icon: "AlertCircle", 
      count: overdueCount,
      variant: "error"
    },
    {
      label: "Completed",
      path: "/completed",
      icon: "CheckCircle",
      count: completedCount,
      variant: "success"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border-r border-gray-200 h-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">TaskFlow</h1>
            <p className="text-sm text-gray-500">Stay organized</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200" 
                  : "hover:bg-gray-50 border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={item.icon} 
                    className={`w-5 h-5 ${
                      isActive ? "text-primary-600" : "text-gray-500"
                    }`} 
                  />
                  <span className={`font-medium ${
                    isActive ? "text-primary-700" : "text-gray-700"
                  }`}>
                    {item.label}
                  </span>
                </div>
                {item.count > 0 && (
                  <Badge 
                    variant={isActive ? "primary" : item.variant || "default"}
                    className="text-xs"
                  >
                    {item.count}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Categories Section */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 font-display">Categories</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateCategory}
            className="p-2 hover:bg-gray-100"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2 custom-scrollbar overflow-y-auto max-h-[60vh]">
          {categories.map((category) => (
            <CategoryItem
              key={category.Id}
              category={category}
              isActive={categoryId === String(category.Id)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          <p>TaskFlow © 2024</p>
          <p className="mt-1">Organize • Focus • Achieve</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;