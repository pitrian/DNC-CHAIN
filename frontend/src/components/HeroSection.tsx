import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroBackground from './HeroBackground';
import TextGenerateEffect from './TextGenerateEffect';
import ShimmerButton from './ShimmerButton';
import GlassButton from './GlassButton';
import SpotlightCard from './SpotlightCard';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <HeroBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Đề án 2728/QĐ-UBND · TP Đà Nẵng</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
            <TextGenerateEffect text="Nền Tảng Xác Thực" className="block" />
            <TextGenerateEffect text="Tin Cậy Số" gradient className="block mt-1" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed"
          >
            Hệ thống xác minh văn bằng, chứng chỉ trên nền tảng blockchain{' '}
            <span className="font-semibold text-blue-400">DNC-Chain</span> —{' '}
            thuộc Đề án thúc đẩy ứng dụng công nghệ chuỗi khối tại TP Đà Nẵng đến năm 2030.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <ShimmerButton href="/verifier">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tra Cứu Văn Bằng</span>
            </ShimmerButton>

            <GlassButton href="/de-an">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Tìm hiểu Đề án 2728</span>
            </GlassButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="grid md:grid-cols-2 gap-5 mt-16 max-w-3xl mx-auto text-left"
          >
            <SpotlightCard
              icon="🔐"
              lead="SP1 · Sở KH&CN"
              title="Bảo đảm toàn vẹn hồ sơ điện tử"
              description="Ghi bằng chứng xác minh cho hồ sơ điện tử, hỗ trợ kiểm chứng trạng thái, truy vết & hậu kiểm giữa các cơ quan."
            />
            <SpotlightCard
              icon="🎓"
              lead="SP2 · Sở GD&ĐT"
              title="Xác minh văn bằng, chứng chỉ"
              description="Xác minh tính hợp lệ của văn bằng, chứng chỉ; chống làm giả, rút ngắn thời gian xác minh khi tuyển dụng."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
