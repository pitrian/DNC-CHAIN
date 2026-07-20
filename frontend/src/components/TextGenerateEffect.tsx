import { motion } from 'framer-motion';

interface Props {
  text: string;
  gradient?: boolean;
  className?: string;
}

export default function TextGenerateEffect({ text, gradient, className = '' }: Props) {
  const words = text.split(' ');

  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-[0.3em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
          className={
            gradient
              ? 'bg-gradient-to-r from-dnc-blue-600 via-blue-400 to-cyan-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent'
              : 'text-dnc-blue-900'
          }
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
