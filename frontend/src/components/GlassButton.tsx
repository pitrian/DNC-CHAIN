import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function GlassButton({ href, children }: Props) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{
          scale: 1.04,
          borderColor: 'rgba(30,58,138,0.3)',
          boxShadow: '0 0 20px rgba(30,58,138,0.1)',
          background: 'rgba(255,255,255,0.85)',
        }}
        whileTap={{ scale: 0.97 }}
        className="relative rounded-xl border border-gray-200/80 bg-white/60 px-7 py-3.5 text-dnc-blue-700 font-semibold text-sm shadow-sm cursor-pointer"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <span className="flex items-center space-x-2">{children}</span>
      </motion.button>
    </Link>
  );
}
