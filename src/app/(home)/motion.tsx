"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadeIn = ({
  children,
  className,
  delay = 0,
}: MotionProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
        filter: "blur(3px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1], // modern ease-out
      }}
      className={cn(
        "w-full overflow-visible will-change-transform",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
