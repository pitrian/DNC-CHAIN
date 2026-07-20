import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function ShimmerButton({ href, children }: Props) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(30,58,138,0.5), 0 0 60px rgba(59,130,246,0.25)' }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-dnc-blue-600 to-dnc-blue-700 px-7 py-3.5 text-white font-semibold text-sm shadow-lg cursor-pointer"
        style={{ boxShadow: '0 0 20px rgba(30,58,138,0.3)' }}
      >
        <span className="absolute inset-0 block pointer-events-none">
          <span className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        </span>
        <span className="relative z-10 flex items-center space-x-2">
          {children}
        </span>
      </motion.button>
    </Link>
  );
}
