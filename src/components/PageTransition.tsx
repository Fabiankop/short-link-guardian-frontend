import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente de transición de página que añade animaciones suaves
 * cuando los componentes entran y salen de la vista
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ""
}) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 8
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -8
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
