import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  animate?: boolean;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  icon: Icon, 
  size = 24, 
  className = '',
  animate = true 
}) => {
  return (
    <motion.div
      whileHover={animate ? { 
        rotate: 360,
        scale: 1.2 
      } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Icon size={size} />
    </motion.div>
  );
};

export default AnimatedIcon;