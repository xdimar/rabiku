"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

interface ScrollFadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  viewportAmount?: number;
}

export default function ScrollFadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.65,
  distance = 32,
  className = "",
  viewportAmount = 0.15,
  ...props
}: ScrollFadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...initialPos,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: false, // Animasi aktif saat scroll dari atas maupun bawah
        amount: viewportAmount,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Cubic-bezier for silky smooth Apple-like easing
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
