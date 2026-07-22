import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import PublicLayout from '../components/PublicLayout';

function DarkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const orbs = [
      { x: 0.15, y: 0.25, r: 250, color: '59,130,246', dx: 0.00025, dy: 0.00015, dr: 0.15 },
      { x: 0.85, y: 0.4, r: 200, color: '139,92,246', dx: -0.00018, dy: 0.0003, dr: -0.1 },
      { x: 0.5, y: 0.65, r: 280, color: '6,182,212', dx: 0.0003, dy: -0.0002, dr: 0.12 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      orbs.forEach((o) => {
        const cx = canvas.width * (o.x + Math.sin(t * o.dx) * 0.06);
        const cy = canvas.height * (o.y + Math.cos(t * o.dy) * 0.06);
        const radius = o.r + Math.sin(t * o.dr) * 25;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(${o.color},0.10)`);
        gradient.addColorStop(0.4, `rgba(${o.color},0.05)`);
        gradient.addColorStop(1, `rgba(${o.color},0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
    </div>
  );
}

type AccentColor = 'blue' | 'green' | 'purple' | 'amber';

const accentMap: Record<AccentColor, { border: string; glow: string; ring: string }> = {
  blue: { border: 'rgba(59,130,246,0.5)', glow: 'rgba(59,130,246,0.12)', ring: 'border-blue-500/40' },
  green: { border: 'rgba(34,197,94,0.5)', glow: 'rgba(34,197,94,0.12)', ring: 'border-green-500/40' },
  purple: { border: 'rgba(168,85,247,0.5)', glow: 'rgba(168,85,247,0.12)', ring: 'border-purple-500/40' },
  amber: { border: 'rgba(245,158,11,0.5)', glow: 'rgba(245,158,11,0.12)', ring: 'border-amber-500/40' },
};

function FeatureCard({ icon, title, desc, accent }: { icon: string; title: string; desc: string; accent: AccentColor }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, ${accentMap[accent].glow}, transparent 70%)`;
  const borderGlow = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${accentMap[accent].border}, transparent 70%)`;

  const colors = accentMap[accent];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 group cursor-default"
      whileHover={{ y: -2 }}
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight, opacity: hovered ? 1 : 0 }} />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ border: '1px solid transparent', maskImage: borderGlow, WebkitMaskImage: borderGlow, opacity: hovered ? 1 : 0 }}
      />
      <div className="relative z-10 flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0 ring-1 ring-slate-700`}>
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">{title}</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-${accent === 'blue' ? 'blue' : accent === 'green' ? 'green' : accent === 'purple' ? 'purple' : 'amber'}-500/0 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
    </motion.div>
  );
}

function StepNode({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="relative flex items-start space-x-5">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-sm font-bold text-blue-400 shrink-0">
          {number}
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-slate-700 to-slate-800 mt-2" />
      </div>
      <div className="pb-8 flex-1">
        <h4 className="font-semibold text-white text-sm mb-2">{title}</h4>
        <div className="text-sm text-slate-400 space-y-1.5">{children}</div>
      </div>
    </div>
  );
}

const neonBadge = (label: string, color: 'green' | 'yellow' | 'red') => {
  const colors = {
    green: 'bg-green-500/10 text-green-400 border-green-500/30 shadow-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/20',
  };
  const icons = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴',
  };
  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${colors[color]}`}>
      <span>{icons[color]}</span>
      <span>{label}</span>
    </span>
  );
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const faqs = [
  { q: 'DNC-CertiTrust có phải là sản phẩm chính thức của Đề án 2728 không?', a: 'Đây là phiên bản thử nghiệm (proof-of-concept) cho SP2 — Xác minh văn bằng, chứng chỉ. Sản phẩm chính thức sẽ do Sở GD&ĐT chủ trì triển khai theo lộ trình của đề án.' },
  { q: 'Tôi có cần trả phí để xác thực văn bằng không?', a: 'Không. Tra cứu & xác thực văn bằng trên DNC-Chain hoàn toàn miễn phí, không cần kết nối ví.' },
  { q: 'Dữ liệu của tôi có được lưu trên blockchain không?', a: 'Không. Blockchain chỉ lưu mã băm (hash) — một "dấu vân tay số" của tài liệu. Nội dung gốc vẫn do cơ quan ban hành quản lý.' },
  { q: 'Làm sao để biết văn bằng của tôi đã được cấp trên DNC-Chain?', a: 'Kết nối ví MetaMask với trang Wallet, hoặc nhập mã băm của văn bằng vào trang Verify để kiểm tra.' },
  { q: 'Tôi có thể chuyển văn bằng cho người khác không?', a: 'Không. Văn bằng tuân theo chuẩn ERC-5192 (Soulbound Token) — không thể chuyển nhượng. Mỗi văn bằng gắn vĩnh viễn với chủ sở hữu.' },
];

const features = [
  { icon: '🔍', title: 'Trust Verification Hub', desc: 'Kiểm tra tính hợp lệ của văn bằng — không cần kết nối ví, chỉ cần tải file hoặc nhập mã băm.', accent: 'blue' as AccentColor },
  { icon: '👛', title: 'Citizen Digital Passport', desc: 'Quản lý tập trung văn bằng, chứng chỉ số (SBT) của bạn trên DNC-Chain.', accent: 'green' as AccentColor },
  { icon: '🏛️', title: 'Issuing Authority Portal', desc: 'Dành cho cơ quan có thẩm quyền cấp văn bằng & đăng ký hồ sơ điện tử.', accent: 'purple' as AccentColor },
  { icon: '📊', title: 'System Governance', desc: 'Giám sát blockchain, RBAC, thống kê & phân tích, quản lý phân quyền.', accent: 'amber' as AccentColor },
];

function HuongDanPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200">
      <DarkBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="space-y-20"
        >
          <motion.div variants={item} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/80 border border-slate-700 rounded-2xl mb-4">
              <span className="text-3xl">📖</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Hướng dẫn sử dụng
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              DNC-CertiTrust — Hệ thống xác minh văn bằng, chứng chỉ trên nền tảng blockchain{' '}
              <span className="text-blue-400 font-medium">DNC-Chain</span> của TP Đà Nẵng
            </p>
          </motion.div>

          <motion.div variants={item}>
            <div className="rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-4">Tổng quan</h2>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed mb-6">
                <p>
                  <strong className="text-white">DNC-CertiTrust</strong> là hệ thống xác minh văn bằng, chứng chỉ trên nền tảng blockchain
                  DNC-Chain, thuộc khuôn khổ <strong className="text-blue-400">Đề án 2728/QĐ-UBND</strong> về thúc đẩy ứng dụng blockchain
                  tại TP Đà Nẵng.
                </p>
                <p className="text-slate-400">Hệ thống gồm 4 thành phần chính:</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((f) => (
                  <FeatureCard key={f.title} {...f} />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>👤 Cho công dân</span>
            </h2>

            <div className="rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-6 sm:p-8">
              <h3 className="font-semibold text-white mb-5">Trust Verification Hub</h3>
              <div className="space-y-0">
                <StepNode number="1" title="Truy cập trang Verify">
                    <p>Truy cập trang <strong className="text-blue-400">Trust Verification Hub</strong> (hoặc truy cập <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 text-xs">/verifier</code>).</p>
                </StepNode>
                <StepNode number="2" title="Tải file hoặc nhập mã băm">
                  <p><strong>Cách 1:</strong> Kéo thả file PDF văn bằng vào ô tải lên — hệ thống tự động tính mã băm và tra cứu.</p>
                  <p><strong>Cách 2:</strong> Nhập mã băm (hash) thủ công nếu đã có sẵn.</p>
                </StepNode>
                <StepNode number="3" title="Nhận kết quả tức thì">
                  <p>Kết quả hiển thị ngay lập tức với các trạng thái:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {neonBadge('Hợp lệ — Tài liệu chưa bị chỉnh sửa', 'green')}
                    {neonBadge('Đã thu hồi — Văn bằng đã bị thu hồi', 'yellow')}
                    {neonBadge('Không tìm thấy — Mã băm không tồn tại', 'red')}
                  </div>
                </StepNode>
              </div>

              <div className="mt-8 border-t border-slate-800 pt-6">
                <h3 className="font-semibold text-white mb-5">Citizen Digital Passport (SBT Wallet)</h3>
                <div className="space-y-0">
                  <StepNode number="1" title="Kết nối ví">
                    <p>Kết nối ví MetaMask (hoặc WalletConnect) qua nút <strong className="text-blue-400">Connect Wallet</strong>.</p>
                  </StepNode>
                  <StepNode number="2" title="Vào trang My Wallet">
                    <p>Truy cập <strong className="text-blue-400">Citizen Digital Passport</strong> (hoặc <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 text-xs">/wallet</code>) để xem danh sách văn bằng ở cột bên trái.</p>
                  </StepNode>
                  <StepNode number="3" title="Xem chi tiết & chia sẻ">
                    <p>Chọn một văn bằng để xem chi tiết: tên, số hiệu, metadata. Dùng <strong className="text-blue-400">QR Code</strong> hoặc nút <strong className="text-blue-400">Sao chép link kiểm chứng</strong> để chia sẻ với nhà tuyển dụng.</p>
                  </StepNode>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-300">
                  💡 Văn bằng tự động cập nhật sau mỗi 5 giây — không cần refresh trang.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span>🏛️ Cho cơ quan (Issuing Authority Portal)</span>
            </h2>
            <div className="rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-6 sm:p-8">
              <p className="text-sm text-slate-300 mb-5">
                Issuing Authority Portal dành cho các Sở, ban ngành có thẩm quyền. Quyền truy cập được quản lý bởi Admin thông qua hợp đồng <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs text-purple-300">DNCAccessControl</code>.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-5">
                  <p className="font-semibold text-white mb-1">🎓 Cấp văn bằng</p>
                  <p className="text-xs text-slate-400">Yêu cầu <strong className="text-blue-400">EDUCATION_ROLE</strong> (Sở GD&ĐT). Nhập địa chỉ ví người nhận + tải file để cấp văn bằng.</p>
                </div>
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-5">
                  <p className="font-semibold text-white mb-1">📄 Đăng ký hồ sơ</p>
                  <p className="text-xs text-slate-400">Yêu cầu <strong className="text-blue-400">SCIENCE_TECH_ROLE</strong> (Sở KH&CN). Đăng ký bằng chứng xác minh cho hồ sơ điện tử.</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300">
                ⚠️ Nếu chưa có quyền, hãy liên hệ Admin (DEFAULT_ADMIN_ROLE) để được cấp quyền tương ứng.
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>⚙️ Cho quản trị viên (System Governance)</span>
            </h2>
            <div className="rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-6 sm:p-8">
              <p className="text-sm text-slate-300 mb-5">
                System Governance cung cấp các công cụ giám sát và quản trị hệ thống.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-5">
                  <p className="font-semibold text-white mb-1">🔐 RBAC Control</p>
                  <p className="text-xs text-slate-400">Admin cấp/thu hồi các vai trò: AUTHORITY, EDUCATION, SCIENCE_TECH.</p>
                </div>
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-5">
                  <p className="font-semibold text-white mb-1">📊 Analytics</p>
                  <p className="text-xs text-slate-400">Biểu đồ tổng quan văn bằng, hồ sơ, xác thực theo thời gian thực.</p>
                </div>
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-5 sm:col-span-1">
                  <p className="font-semibold text-white mb-1">📡 On-chain Audit Trail</p>
                  <p className="text-xs text-slate-400">Dòng sự kiện real-time cập nhật mỗi 2 giây.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>❓ Câu hỏi thường gặp</span>
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="group rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 overflow-hidden">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none text-sm font-medium text-white hover:text-blue-400 transition-colors">
                    <span>{faq.q}</span>
                    <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-sm text-slate-400 border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="rounded-2xl bg-gradient-to-br from-blue-600/10 via-slate-900 to-purple-600/10 border border-blue-500/20 p-8 sm:p-10 text-center">
              <p className="text-lg font-semibold text-white mb-2">Cần hỗ trợ thêm?</p>
              <p className="text-sm text-slate-400">
                Liên hệ <span className="text-blue-400 font-medium">Sở Khoa học & Công nghệ TP Đà Nẵng</span> để được hướng dẫn chi tiết.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function HuongDanPageWrapper() {
  return (
    <PublicLayout>
      <HuongDanPage />
    </PublicLayout>
  );
}
