import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isPast, parseISO } from "date-fns";
import { toast } from "react-toastify";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskCard = ({ task, onUpdate, onDelete, category }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

const handleToggleComplete = async () => {
    setIsCompleting(true);
    
    try {
      const currentCompleted = task.completed_c !== undefined ? task.completed_c : task.completed;
      
      if (!currentCompleted) {
        // Show confetti animation before updating
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 600);
        
        // Add completion animation class
        const cardElement = document.getElementById(`task-${task.Id}`);
        if (cardElement) {
          cardElement.classList.add('task-complete-animation');
          setTimeout(() => {
            cardElement.classList.remove('task-complete-animation');
          }, 300);
        }
        
        toast.success("🎉 Task completed! Great job!");
      }
      
      await onUpdate(task.Id, { completed_c: !currentCompleted });
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setIsCompleting(false);
    }
  };

const handleDelete = async () => {
    try {
      await onDelete(task.Id);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

const getDueDateInfo = () => {
    const dueDate = task.due_date_c || task.dueDate;
    if (!dueDate) return null;
    
    const parsedDate = parseISO(dueDate);
    const currentCompleted = task.completed_c !== undefined ? task.completed_c : task.completed;
    const isOverdue = isPast(parsedDate) && !isToday(parsedDate) && !currentCompleted;
    const isDueToday = isToday(parsedDate) && !currentCompleted;
    
    return {
      formatted: format(parsedDate, "MMM d"),
      isOverdue,
      isDueToday
    };
  };

  const dueDateInfo = getDueDateInfo();
  const priorityColor = category?.color || "#5B47E0";

  return (
<motion.div
      id={`task-${task.Id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      whileHover={{ scale: 1.01, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      className={`bg-surface p-4 rounded-lg border border-gray-100 transition-all duration-200 relative ${
        (task.completed_c !== undefined ? task.completed_c : task.completed) ? "opacity-80" : ""
      }`}
    >
      {/* Priority Indicator */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: priorityColor }}
      />
      
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 0], rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="text-4xl">🎉</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="mt-1">
            <Checkbox
checked={task.completed_c !== undefined ? task.completed_c : task.completed}
              onChange={handleToggleComplete}
              disabled={isCompleting}
            />
          </div>
          
          <div className="flex-1 min-w-0">
<h3 className={`font-medium text-gray-900 leading-5 ${
              (task.completed_c !== undefined ? task.completed_c : task.completed) ? "line-through text-gray-500" : ""
            }`}>
              {task.title_c || task.title}
            </h3>
            
{(task.description_c || task.description) && (
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {task.description_c || task.description}
              </p>
            )}
            
<div className="flex items-center space-x-3 mt-3">
              <Badge variant={task.priority_c || task.priority}>{task.priority_c || task.priority}</Badge>
              
              {category && (
                <Badge 
                  variant="default" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${category.color}15`,
                    color: category.color 
                  }}
                >
                  {category.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          {dueDateInfo && (
            <Badge 
              variant={dueDateInfo.isOverdue ? "error" : dueDateInfo.isDueToday ? "warning" : "default"}
              className="text-xs whitespace-nowrap"
            >
              {dueDateInfo.isOverdue && <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />}
              {dueDateInfo.isDueToday && <ApperIcon name="Clock" className="w-3 h-3 mr-1" />}
              {dueDateInfo.formatted}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 hover:text-error transition-all p-2"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;