import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CategoryItem = ({ category, isActive }) => {
  return (
    <NavLink to={`/category/${category.Id}`}>
      <motion.div
        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group cursor-pointer ${
          isActive 
            ? "bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200" 
            : "hover:bg-gray-50 border border-transparent"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
          <span className={`font-medium ${isActive ? "text-primary-700" : "text-gray-700"}`}>
            {category.name}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant={isActive ? "primary" : "default"} 
            className="text-xs"
          >
            {category.taskCount}
          </Badge>
          <ApperIcon 
            name="ChevronRight" 
            className={`w-4 h-4 transition-transform duration-200 ${
              isActive 
                ? "text-primary-600 rotate-90" 
                : "text-gray-400 group-hover:translate-x-1"
            }`} 
          />
        </div>
      </motion.div>
    </NavLink>
  );
};

export default CategoryItem;