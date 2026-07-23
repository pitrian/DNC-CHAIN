import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent, useCallback } from 'react';

interface Props {
  title: string;
  lead: string;
  description: string;
  icon: string;
}

export default function SpotlightCard({ title, lead, description, icon }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: MouseEvent) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY],
  );

  const spotlight = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(59,130,246,0.12), transparent 80%)`;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 group"
      whileHover={{ borderColor: 'rgba(59,130,246,0.3)', y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlight }}
      />

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-lg shrink-0">
            {icon}
          </div>
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              {lead}
            </span>
            <h3 className="font-semibold text-slate-100 text-sm leading-tight">
              {title}
            </h3>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/30 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
}
