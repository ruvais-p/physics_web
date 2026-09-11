interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  animKey?: string | number;
}

/** Lightweight CSS-only word reveal used by the hero slider. */
export default function TextReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.06,
  animKey,
}: TextRevealProps) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span
      key={animKey}
      className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden pb-[0.08em]"
          aria-hidden="true"
        >
          <span
            className="text-reveal-word inline-block"
            style={{ animationDelay: `${delay + index * stagger}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
