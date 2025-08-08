import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className,
  checked = false,
  onChange,
  ...props 
}, ref) => {
  return (
    <motion.div 
      className={cn("relative inline-flex items-center", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div 
        className={cn(
          "w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer",
          checked 
            ? "bg-primary-500 border-primary-500" 
            : "bg-white border-gray-300 hover:border-primary-400"
        )}
        onClick={() => onChange?.({ target: { checked: !checked } })}
      >
        <motion.div
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center h-full"
        >
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;