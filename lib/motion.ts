/**
 * Switch Motion System
 * -------------------
 * Centralised animation tokens, Framer Motion variants, and helpers.
 * All durations, easings, and transition presets are defined here once
 * and imported by every animated component – never hard-coded inline.
 *
 * Uses `prefers-reduced-motion` via the `useReducedMotion` hook from
 * Framer Motion.  Every variant set ships a reduced-motion override.
 */

import type { Variants, Transition } from "framer-motion";

// ─────────────────────────────────────────────
// 1. Duration tokens (ms)
// ─────────────────────────────────────────────
export const duration = {
  fast: 0.15,
  normal: 0.22,
  smooth: 0.30,
  slow: 0.40,
} as const;

// ─────────────────────────────────────────────
// 2. Easing tokens
// ─────────────────────────────────────────────
export const ease = {
  standard: [0.2, 0, 0, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const, // kept same – we avoid springy overshoots
  out: [0, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
} as const;

// ─────────────────────────────────────────────
// 3. Shared transition presets
// ─────────────────────────────────────────────
export const transition = {
  fast: { duration: duration.fast, ease: ease.standard } satisfies Transition,
  normal: { duration: duration.normal, ease: ease.standard } satisfies Transition,
  smooth: { duration: duration.smooth, ease: ease.standard } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.standard } satisfies Transition,
  stagger: (i: number, base = 0.06) => ({ delay: i * base }) satisfies Transition,
} as const;

// ─────────────────────────────────────────────
// 4. Page / route transition variants
// ─────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.smooth, ease: ease.standard } },
  exit:    { opacity: 0, y: -6, transition: { duration: duration.normal, ease: ease.in } },
};

// Reduced-motion version of page transition
export const pageVariantsReduced: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.normal } },
  exit:    { opacity: 0, transition: { duration: duration.fast } },
};

// ─────────────────────────────────────────────
// 5. Feed item entrance variants
// ─────────────────────────────────────────────
export const feedItemVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.smooth, ease: ease.standard, delay: Math.min(i * 0.05, 0.3) },
  }),
};

export const feedItemVariantsReduced: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.normal } },
};

// ─────────────────────────────────────────────
// 6. Modal variants
// ─────────────────────────────────────────────
export const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.normal } },
  exit:    { opacity: 0, transition: { duration: duration.fast } },
};

export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.96, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: duration.smooth, ease: ease.standard } },
  exit:    { opacity: 0, scale: 0.97, y: 6, transition: { duration: duration.fast, ease: ease.in } },
};

export const modalVariantsReduced: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.normal } },
  exit:    { opacity: 0, transition: { duration: duration.fast } },
};

// ─────────────────────────────────────────────
// 7. Drawer variants (slide-in from right)
// ─────────────────────────────────────────────
export const drawerVariants: Variants = {
  hidden:  { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: duration.smooth, ease: ease.standard } },
  exit:    { x: "100%", opacity: 0, transition: { duration: duration.normal, ease: ease.in } },
};

export const drawerVariantsReduced: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.normal } },
  exit:    { opacity: 0, transition: { duration: duration.fast } },
};

// ─────────────────────────────────────────────
// 8. Dropdown / popover variants
// ─────────────────────────────────────────────
export const dropdownVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.96, y: -6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: duration.fast, ease: ease.standard } },
  exit:    { opacity: 0, scale: 0.97, y: -4, transition: { duration: duration.fast, ease: ease.in } },
};

// ─────────────────────────────────────────────
// 9. Skeleton shimmer keyframes (CSS injection helper)
// ─────────────────────────────────────────────
export const skeletonKeyframes = `
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
`;

// ─────────────────────────────────────────────
// 10. Tab indicator helper
// ─────────────────────────────────────────────
export const tabIndicatorTransition: Transition = {
  layout: { duration: duration.normal, ease: ease.standard },
};

// ─────────────────────────────────────────────
// 11. Micro-interaction helpers
// ─────────────────────────────────────────────
/** Slight downscale on press, restored on release */
export const pressScaleProps = {
  whileTap: { scale: 0.97 },
  transition: { duration: duration.fast, ease: ease.standard },
};

/** Scale-pop for like / reaction buttons */
export const likePopProps = {
  whileTap: { scale: 0.88 },
  transition: { type: "spring", stiffness: 400, damping: 20 } as Transition,
};

/** Slight lift + shadow upgrade on hover – used as inline `whileHover` */
export const cardHoverProps = {
  whileHover: { y: -2 },
  transition: { duration: duration.normal, ease: ease.standard },
};

