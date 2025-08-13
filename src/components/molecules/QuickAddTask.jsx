import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuickAddTask = ({ onTaskCreate, categories = [] }) => {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAdding(true);
try {
      await onTaskCreate({
        title_c: title.trim(),
        description_c: "",
        category_id_c: categories[0]?.Id || 1,
        priority_c: "medium",
        due_date_c: null
      });
      setTitle("");
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
      whileHover={{ shadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 focus:ring-0 bg-transparent placeholder:text-gray-400"
        />
      </div>
      <Button
        type="submit"
        disabled={!title.trim() || isAdding}
        size="sm"
        className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-md hover:shadow-lg"
      >
        {isAdding ? (
          <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
        ) : (
          <ApperIcon name="Plus" className="w-4 h-4" />
        )}
      </Button>
    </motion.form>
  );
};

export default QuickAddTask;