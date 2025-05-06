import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  location: string;
  previousLocation: string;
}

export default function PageTransition({ children, location, previousLocation }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ 
          opacity: 0, 
          y: previousLocation === "/" ? 20 : -20 
        }}
        animate={{ 
          opacity: 1, 
          y: 0 
        }}
        exit={{ 
          opacity: 0, 
          y: location === "/" ? -20 : 20 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
