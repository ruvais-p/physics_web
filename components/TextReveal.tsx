'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';

interface TextRevealProps {
  /** The text to animate. Split into words automatically. */
  text: string;
  className?: string;
  /** Seconds to wait before the first word starts animating. */
  delay?: number;
  /** Seconds between each word's animation start. */
  stagger?: number;
  /** Change this whenever you want the animation to replay (e.g. slide index). */
  animKey?: string | number;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { delay: number; stagger: number }) => ({
    transition: {
      delayChildren: custom.delay,
      staggerChildren: custom.stagger,
    },
  }),
};

const wordVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { delay: number; stagger: number }) => ({
    opacity: 1,
    transition: { delayChildren: custom.delay, staggerChildren: custom.stagger },
  }),
};

const reducedMotionWord: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * TextReveal — a masked, word-by-word slide-up reveal, the effect used on
 * the JAIN University hero ("BE THE CHANGE / BE THE FUTURE"): each word sits
 * in an overflow-hidden box and rises from below into place, staggered
 * left-to-right, so the headline appears to "unmask" itself.
 *
 * Pass a new `animKey` (e.g. the current slide index) to force a replay,
 * which is how the hero-slider transition below re-triggers the effect.
 */
export default function TextReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.08,
  animKey,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  const container = prefersReducedMotion ? reducedMotionVariants : containerVariants;
  const word = prefersReducedMotion ? reducedMotionWord : wordVariants;

  return (
    <motion.span
      key={animKey}
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      custom={{ delay, stagger }}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden pb-[0.08em]"
        >
          <motion.span className="inline-block will-change-transform" variants={word}>
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
