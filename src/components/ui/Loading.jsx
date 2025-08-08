import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <motion.div 
            className="h-8 bg-gray-200 rounded-lg w-48"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div 
            className="h-4 bg-gray-200 rounded w-32"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
        <motion.div 
          className="w-16 h-16 bg-gray-200 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
        />
      </div>

      {/* Quick Add Skeleton */}
      <motion.div 
        className="h-12 bg-gray-200 rounded-lg w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />

      {/* Task Cards Skeleton */}
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <motion.div 
            key={index}
            className="bg-surface p-4 rounded-lg border border-gray-100 space-y-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-5 h-5 bg-gray-200 rounded border-2" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
                <div className="w-6 h-6 bg-gray-200 rounded" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;