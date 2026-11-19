/**
 * Switch Animated Primitives
 * --------------------------
 * Lightweight, reusable wrappers over Framer Motion.
 * Import these instead of raw <motion.*> in page and feature components.
 *
 * All components honour `prefers-reduced-motion` automatically.
 */

"use client";

import React from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type HTMLMotionProps,
  type MotionProps,
} from "framer-motion";
import {
  pageVariants,
  pageVariantsReduced,
  feedItemVariants,
  feedItemVariantsReduced,
  backdropVariants,
  modalVariants,
  modalVariantsReduced,
  drawerVariants,
  drawerVariantsReduced,
  dropdownVariants,
  duration,
  ease,
} from "@/lib/motion";

// ─────────────────────────────────────────────
// PageTransition — wrap each page's root element
// ─────────────────────────────────────────────
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const reduced = useReducedMotion();
  const v = reduced ? pageVariantsReduced : pageVariants;
  return (
    <motion.div
      variants={v}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// FeedItem — staggered entrance for feed cards
// ─────────────────────────────────────────────
interface FeedItemProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export const FeedItem: React.FC<FeedItemProps> = ({ children, index = 0, className }) => {
  const reduced = useReducedMotion();
  const v = reduced ? feedItemVariantsReduced : feedItemVariants;
  return (
    <motion.div
      custom={index}
      variants={v}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// AnimatedBackdrop — modal / drawer overlay
// ─────────────────────────────────────────────
interface BackdropProps {
  onClick?: () => void;
  className?: string;
}

export const AnimatedBackdrop: React.FC<BackdropProps> = ({ onClick, className }) => (
  <motion.div
    variants={backdropVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onClick={onClick}
    className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] ${className ?? ""}`}
  />
);

// ─────────────────────────────────────────────
// AnimatedModal — dialog panel
// ─────────────────────────────────────────────
interface AnimatedModalProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({ children, className }) => {
  const reduced = useReducedMotion();
  const v = reduced ? modalVariantsReduced : modalVariants;
  return (
    <motion.div
      variants={v}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// AnimatedDrawer — right-side drawer panel
// ─────────────────────────────────────────────
interface AnimatedDrawerProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedDrawer: React.FC<AnimatedDrawerProps> = ({ children, className }) => {
  const reduced = useReducedMotion();
  const v = reduced ? drawerVariantsReduced : drawerVariants;
  return (
    <motion.div
      variants={v}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// AnimatedDropdown — small pop-over / menu
// ─────────────────────────────────────────────
interface AnimatedDropdownProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({ children, className }) => (
  <motion.div
    variants={dropdownVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

// ─────────────────────────────────────────────
// PressButton — button with press feedback
// ─────────────────────────────────────────────
type PressButtonProps = HTMLMotionProps<"button"> & {
  disableScale?: boolean;
};

export const PressButton: React.FC<PressButtonProps> = ({
  children,
  disableScale,
  className,
  ...rest
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.button
      whileTap={!reduced && !disableScale ? { scale: 0.97 } : undefined}
      transition={{ duration: duration.fast, ease: ease.standard }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

// ─────────────────────────────────────────────
// LikeButton — like / reaction with pop
// ─────────────────────────────────────────────
type LikeButtonProps = HTMLMotionProps<"button">;

export const LikeButton: React.FC<LikeButtonProps> = ({ children, className, ...rest }) => {
  const reduced = useReducedMotion();
  return (
    <motion.button
      whileTap={!reduced ? { scale: 0.85 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

// ─────────────────────────────────────────────
// FadeIn — simple opacity entrance
// ─────────────────────────────────────────────
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration: d = 0.3,
  className,
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.15 : d, delay, ease: ease.standard }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Re-export AnimatePresence for convenience
// ─────────────────────────────────────────────
export { AnimatePresence };

