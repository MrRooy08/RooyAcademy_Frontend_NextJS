
import { motion } from "framer-motion";

const CourseCard = ({ icon, title, description, isSelected = false, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        relative p-8 rounded-lg border-2 cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-lg' 
          : 'border-border hover:border-primary/50 hover:shadow-md'
        }
        min-h-[280px] flex flex-col items-center text-center
      `}
    >
      <motion.div 
        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`
          mb-6 p-4 rounded-full 
          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
        `}
      >
        {icon}
      </motion.div>
      
      <h3 className={`text-xl font-semibold mb-4 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
        {title}
      </h3>
      
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
        {description}
      </p>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CourseCard;