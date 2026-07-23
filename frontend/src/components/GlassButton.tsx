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
          borderColor: 'rgba(59,130,246,0.3)',
          boxShadow: '0 0 20px rgba(59,130,246,0.1)',
          background: 'rgba(30,41,59,0.85)',
        }}
        whileTap={{ scale: 0.97 }}
        className="relative rounded-xl border border-slate-600/50 bg-slate-800/60 px-7 py-3.5 text-blue-300 font-semibold text-sm shadow-sm cursor-pointer"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <span className="flex items-center space-x-2">{children}</span>
      </motion.button>
    </Link>
  );
}
