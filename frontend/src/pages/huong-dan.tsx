import React from 'react';

const faqs = [
  { q: 'DNC-CertiTrust có phải là sản phẩm chính thức của Đề án 2728 không?', a: 'Đây là phiên bản thử nghiệm (proof-of-concept) cho SP2 — Xác minh văn bằng, chứng chỉ. Sản phẩm chính thức sẽ do Sở GD&ĐT chủ trì triển khai theo lộ trình của đề án.' },
  { q: 'Tôi có cần trả phí để xác thực văn bằng không?', a: 'Không. Tra cứu & xác thực văn bằng trên DNC-Chain hoàn toàn miễn phí, không cần kết nối ví.' },
  { q: 'Dữ liệu của tôi có được lưu trên blockchain không?', a: 'Không. Blockchain chỉ lưu mã băm (hash) — một &quot;dấu vân tay số&quot; của tài liệu. Nội dung gốc vẫn do cơ quan ban hành quản lý.' },
  { q: 'Làm sao để biết văn bằng của tôi đã được cấp trên DNC-Chain?', a: 'Kết nối ví MetaMask với trang Wallet, hoặc nhập mã băm của văn bằng vào trang Verify để kiểm tra.' },
  { q: 'Tôi có thể chuyển văn bằng cho người khác không?', a: 'Không. Văn bằng tuân theo chuẩn ERC-5192 (Soulbound Token) — không thể chuyển nhượng. Mỗi văn bằng gắn vĩnh viễn với chủ sở hữu.' },
];

export default function HuongDanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-dnc-blue-100 rounded-2xl mb-4">
          <span className="text-3xl">📖</span>
        </div>
        <h1 className="section-title">Hướng dẫn sử dụng</h1>
        <p className="section-subtitle">
          DNC-CertiTrust — Hệ thống xác minh văn bằng, chứng chỉ trên blockchain của TP Đà Nẵng
        </p>
      </div>

      <section className="mb-10">
        <div className="card">
          <h2 className="text-lg font-bold text-dnc-blue-900 mb-3">Tổng quan</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>DNC-CertiTrust</strong> là hệ thống xác minh văn bằng, chứng chỉ trên nền tảng blockchain
              DNC-Chain, thuộc khuôn khổ <strong>Đề án 2728/QĐ-UBND</strong> về thúc đẩy ứng dụng blockchain
              tại TP Đà Nẵng.
            </p>
            <p>Hệ thống gồm 4 thành phần chính:</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="font-semibold text-dnc-blue-900">🔍 Tra cứu & Xác thực</p>
                <p className="text-xs text-gray-600 mt-1">Kiểm tra tính hợp lệ của văn bằng — không cần kết nối ví</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="font-semibold text-dnc-blue-900">👛 Ví Công dân</p>
                <p className="text-xs text-gray-600 mt-1">Quản lý văn bằng số của bạn trên DNC-Chain</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="font-semibold text-dnc-blue-900">🏛️ Issuer Portal</p>
                <p className="text-xs text-gray-600 mt-1">Dành cho cơ quan có thẩm quyền cấp văn bằng & đăng ký hồ sơ</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="font-semibold text-dnc-blue-900">📊 Dashboard</p>
                <p className="text-xs text-gray-600 mt-1">Giám sát hoạt động blockchain, thống kê & phân tích, quản lý phân quyền</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-dnc-blue-900 mb-4">👤 Cho công dân</h2>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-dnc-blue-900 mb-2">Tra cứu & Xác thực văn bằng</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Vào trang <strong>Verify</strong> (hoặc truy cập <code className="bg-gray-100 px-1 rounded">/verifier</code>)</li>
              <li><strong>Cách 1:</strong> Kéo thả file PDF văn bằng vào ô tải lên — hệ thống tự động tính mã băm và tra cứu</li>
              <li><strong>Cách 2:</strong> Nhập mã băm (hash) thủ công nếu đã có sẵn</li>
              <li>Kết quả hiển thị ngay lập tức:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li><span className="text-green-600 font-medium">🟢 Hợp lệ</span> — Tài liệu chưa bị chỉnh sửa, có giá trị pháp lý</li>
                  <li><span className="text-yellow-600 font-medium">🟡 Đã thu hồi</span> — Văn bằng đã bị cơ quan ban hành thu hồi</li>
                  <li><span className="text-red-600 font-medium">🔴 Không tìm thấy</span> — Mã băm không tồn tại trên blockchain</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="card">
            <h3 className="font-semibold text-dnc-blue-900 mb-2">Quản lý văn bằng (Ví Công dân)</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Kết nối ví MetaMask (hoặc WalletConnect) qua nút <strong>Connect Wallet</strong></li>
              <li>Vào trang <strong>My Wallet</strong> (hoặc truy cập <code className="bg-gray-100 px-1 rounded">/wallet</code>)</li>
              <li>Xem danh sách văn bằng của bạn ở cột bên trái</li>
              <li>Chọn một văn bằng để xem chi tiết: tên, số hiệu, metadata</li>
              <li>Dùng <strong>QR Code</strong> hoặc nút <strong>Sao chép link kiểm chứng</strong> để chia sẻ với nhà tuyển dụng</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
              💡 Văn bằng tự động cập nhật sau mỗi 5 giây — không cần refresh trang.
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-dnc-blue-900 mb-4">🏛️ Cho cơ quan (Issuer Portal)</h2>
        <div className="card space-y-3">
          <p className="text-sm text-gray-700">
            Issuer Portal dành cho các Sở, ban ngành có thẩm quyền. Quyền truy cập được quản lý bởi Admin thông qua hợp đồng DNCAccessControl.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="font-semibold text-dnc-blue-900 mb-1">🎓 Cấp văn bằng</p>
              <p className="text-xs text-gray-600">Yêu cầu <strong>EDUCATION_ROLE</strong> (Sở GD&ĐT). Nhập địa chỉ ví người nhận + tải file để cấp văn bằng.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="font-semibold text-dnc-blue-900 mb-1">📄 Đăng ký hồ sơ</p>
              <p className="text-xs text-gray-600">Yêu cầu <strong>SCIENCE_TECH_ROLE</strong> (Sở KH&CN). Đăng ký bằng chứng xác minh cho hồ sơ điện tử.</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            ⚠️ Nếu chưa có quyền, hãy liên hệ Admin (DEFAULT_ADMIN_ROLE) để được cấp quyền tương ứng.
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-dnc-blue-900 mb-4">⚙️ Cho quản trị viên (Dashboard)</h2>
        <div className="card space-y-3">
          <p className="text-sm text-gray-700">
            Dashboard cung cấp các công cụ giám sát và quản trị hệ thống.
          </p>
          <div className="space-y-3">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="font-semibold text-dnc-blue-900 mb-1">🔐 Quản lý phân quyền</p>
              <p className="text-xs text-gray-600">Admin có thể cấp/thu hồi các vai trò: AUTHORITY, EDUCATION, SCIENCE_TECH. Chỉ cần nhập địa chỉ ví và chọn thao tác.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <p className="font-semibold text-dnc-blue-900 mb-1">📊 Thống kê & Phân tích</p>
              <p className="text-xs text-gray-600">Biểu đồ tổng quan: tổng số văn bằng, tổng số hồ sơ, tổng số lần xác thực, và biểu đồ theo tháng.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="font-semibold text-dnc-blue-900 mb-1">📡 Event Stream</p>
              <p className="text-xs text-gray-600">Dòng sự kiện real-time: cấp văn bằng, đăng ký hồ sơ, xác thực — cập nhật mỗi 2 giây.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-dnc-blue-900 mb-4">❓ Câu hỏi thường gặp</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="card group open:border-dnc-blue-300">
              <summary className="font-medium text-dnc-blue-900 cursor-pointer list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-gray-600 border-t pt-3">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <div className="card bg-gradient-to-r from-dnc-blue-900 to-dnc-blue-700 text-white text-center">
          <p className="text-lg font-semibold mb-2">Cần hỗ trợ thêm?</p>
          <p className="text-sm text-blue-200">
            Liên hệ Sở Khoa học & Công nghệ TP Đà Nẵng để được hướng dẫn chi tiết.
          </p>
        </div>
      </section>
    </div>
  );
}
