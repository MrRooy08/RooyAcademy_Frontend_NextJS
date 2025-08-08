
import { motion } from "framer-motion";
import Link from "next/link";
const Header = ({ currentStep = 1 }) => {
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-background border-b border-border p-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-primary"
          >
            ROOY
          </motion.div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Bước {currentStep}/{totalSteps}</span>
            <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: "25%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <Link href="/dashboard">
            Thoát
          </Link>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;