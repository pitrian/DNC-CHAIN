import React from 'react';
import PublicLayout from '../components/PublicLayout';

const legalBases = [
  { id: 'NQ 57', title: 'Nghị quyết 57-NQ/TW (2024)', desc: 'về đột phá KHCN, ĐMST & CĐS quốc gia' },
  { id: 'QĐ 1236', title: 'Chiến lược quốc gia về blockchain', desc: 'đến 2025, định hướng 2030' },
  { id: 'NQ 08', title: 'NQ 08-NQ/TU của Đảng bộ Đà Nẵng', desc: 'về Đề án Chuyển đổi số 2026-2030' },
  { id: 'Luật DL', title: 'Luật Dữ liệu 60/2024', desc: 'Luật Giao dịch điện tử, Luật Bảo vệ dữ liệu cá nhân' },
  { id: 'NQ 136', title: 'Cơ chế đặc thù phát triển TP Đà Nẵng', desc: 'sandbox' },
  { id: 'QĐ 2815', title: 'Chương trình KHCN quốc gia', desc: 'phát triển sản phẩm công nghệ chiến lược' },
];

const tiers = [
  {
    label: 'Tầng 1 · Sẵn sàng cao — làm trước',
    period: '2026-2027',
    products: [
      { id: 'SP1', name: 'Bảo đảm toàn vẹn hồ sơ điện tử', desc: 'Ghi bằng chứng xác minh cho hồ sơ điện tử, hỗ trợ kiểm chứng trạng thái, truy vết & hậu kiểm giữa các cơ quan.', lead: 'Sở KH&CN' },
      { id: 'SP2', name: 'Xác minh văn bằng, chứng chỉ', desc: 'Xác minh tính hợp lệ của văn bằng, chứng chỉ; chống làm giả, rút ngắn thời gian xác minh khi tuyển dụng.', lead: 'Sở GD&ĐT' },
    ],
  },
  {
    label: 'Tầng 2 · Yêu cầu dữ liệu & pháp lý cao hơn',
    period: '2028-2030',
    products: [
      { id: 'SP3', name: 'Digital Twin đô thị tích hợp blockchain', desc: 'Bản sao số đô thị; ghi nhận & kiểm chứng sự kiện vòng đời hạ tầng (nghiệm thu, bảo trì, trách nhiệm).', lead: 'Sở KH&CN' },
      { id: 'SP4', name: 'Xác minh hồ sơ y tế', desc: 'Bổ sung lớp tin cậy cho hồ sơ y tế; xác minh, đối soát giữa các cơ sở khám chữa bệnh.', lead: 'Sở Y tế' },
    ],
  },
  {
    label: 'Tầng 3 · Kinh tế dữ liệu & dịch vụ số',
    period: '2028-2030',
    products: [
      { id: 'SP5', name: 'Sàn giao dịch dữ liệu thành phố', desc: 'Niêm yết dữ liệu, cấp phép khai thác & ghi nhận giao dịch dữ liệu trong môi trường có kiểm soát.', lead: 'Sở KH&CN' },
      { id: 'SP6', name: 'Sàn giao dịch tài sản sở hữu trí tuệ', desc: 'Xác minh, truy vết giao dịch tài sản SHTT; gắn các trung tâm đổi mới sáng tạo.', lead: 'Sở KH&CN' },
      { id: 'SP7', name: 'City Loyalty Program', desc: 'Chương trình khách hàng trung thành của thành phố (du lịch, dịch vụ) trên nền token điểm thưởng.', lead: 'Sở VH-TT&DL' },
    ],
  },
  {
    label: 'Tầng 4 · Tài chính số chuyên biệt — sandbox / IFC',
    period: 'Theo cơ chế riêng',
    products: [
      { id: 'SP8', name: 'Chuyển đổi tài sản mã hóa → tiền pháp định', desc: 'Theo dõi, điều phối trong cơ chế sandbox & pháp luật chuyên ngành.', lead: 'Sở KH&CN' },
      { id: 'SP9', name: 'Phát hành, lưu ký & giao dịch TSMH có bảo đảm', desc: 'Mô hình tài chính số trong khuôn khổ IFC; Đề án chỉ tiếp nhận – điều phối – giám sát.', lead: 'IFC Đà Nẵng' },
      { id: 'SP10', name: 'Nền tảng gọi vốn cộng đồng trên blockchain', desc: 'Gọi vốn cộng đồng theo cơ chế riêng; ngân sách NN không đầu tư phần thương mại.', lead: 'IFC Đà Nẵng' },
    ],
  },
];

const phases = [
  { period: 'T1 · 2026-2027', title: 'Giai đoạn nền tảng', desc: 'Dựng hạ tầng & chạy 2 sản phẩm "chín" nhất', items: ['Hoàn thiện thể chế, xây DNC-Chain + 7 mô đun', 'Triển khai SP1 (toàn vẹn hồ sơ điện tử)', 'Triển khai SP2 (xác minh văn bằng, chứng chỉ)'] },
  { period: 'T2 · 2028-2030', title: 'Mở rộng thận trọng', desc: 'Sản phẩm yêu cầu dữ liệu & pháp lý cao hơn', items: ['Triển khai SP3 (Digital Twin đô thị)', 'Triển khai SP4 (xác minh hồ sơ y tế)', 'Có phạm vi thí điểm, không dàn trải'] },
  { period: 'T3 · 2028-2030', title: 'Kinh tế dữ liệu', desc: 'Dịch vụ số & khai thác dữ liệu', items: ['SP5 (sàn giao dịch dữ liệu)', 'SP6 (sàn tài sản sở hữu trí tuệ)', 'SP7 (City Loyalty)'] },
  { period: 'T4 · Theo sandbox/IFC', title: 'Mô hình tài chính số chuyên biệt', desc: 'Cơ chế riêng', items: ['SP8, SP9, SP10 gắn tài sản mã hóa', 'Đề án chỉ tiếp nhận – điều phối – giám sát', 'NSNN không đầu tư phần thương mại'] },
];

const riskGroups = [
  { label: 'Kỹ thuật', icon: '🖥️', items: 'Sự cố hạ tầng, lỗ hổng bảo mật, dữ liệu nguồn chưa chuẩn, sai lệch on-chain ↔ nguồn' },
  { label: 'Tài chính & tuân thủ', icon: '💰', items: 'Vượt dự toán, vướng pháp lý chuyên ngành, tuân thủ phòng chống rửa tiền' },
  { label: 'Xã hội', icon: '👪', items: 'Tác động tới người dân, doanh nghiệp; chấp nhận & sử dụng dịch vụ mới' },
  { label: 'Uy tín', icon: '🏷️', items: 'Rủi ro hình ảnh khi sản phẩm chậm, lỗi hoặc bị lợi dụng' },
  { label: 'Vận hành', icon: '⚙️', items: 'Nguồn lực, nhân sự, tổ chức thực hiện trong từng giai đoạn triển khai' },
];

function DeAnPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-dnc-blue-900 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-4">
          <span>⛓️</span>
          <span>DNC-Chain · Đề án 2728</span>
        </div>
        <h1 className="text-3xl font-bold text-dnc-blue-900 mb-3 leading-tight">
          Đề án thúc đẩy ứng dụng & phát triển<br />
          công nghệ chuỗi khối (blockchain)<br />
          tại TP Đà Nẵng đến năm 2030
        </h1>
        <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">Quyết định 2728/QĐ-UBND</span>
          <span>23/6/2026</span>
          <span>UBND TP Đà Nẵng</span>
        </div>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Xây dựng DNC-Chain — hạ tầng blockchain dùng chung của thành phố, đóng vai trò &quot;lớp tin cậy số&quot; để xác minh, kiểm chứng, truy vết và đối soát dữ liệu; từng bước triển khai 10 sản phẩm ứng dụng phục vụ chính quyền số và kinh tế dữ liệu.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-gray-400">
          <span>📜 Cơ quan ban hành: UBND TP Đà Nẵng</span>
          <span>✍️ Người ký: Hồ Quang Bửu (Phó Chủ tịch)</span>
          <span>🏛️ Chủ trì: Sở Khoa học & Công nghệ</span>
          <span>📄 241 trang · 6 chương · 3 phụ lục</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { value: '268 tỷ', label: 'Tổng kinh phí (đồng), 2026-2030' },
          { value: '10', label: 'Sản phẩm ứng dụng (SP1-SP10)' },
          { value: '1.000+', label: 'Nhân lực blockchain đến 2030' },
          { value: '30+', label: 'Doanh nghiệp tham gia hệ sinh thái' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-3xl font-bold text-dnc-blue-700">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-4">Đề án này là gì?</h2>
        <div className="card space-y-4">
          <p className="text-gray-700">
            UBND TP Đà Nẵng ban hành đề án để đưa công nghệ blockchain vào phục vụ quản lý nhà nước. Đây là văn bản khung định hướng đến 2030 — đặt nền móng hạ tầng và lộ trình.
          </p>
          <div className="grid md:grid-cols-3 gap-4 pt-2">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="font-semibold text-dnc-blue-800 mb-1">🎯 Vì sao làm?</p>
              <p className="text-sm text-gray-600">Triển khai NQ 57-NQ/TW, Chiến lược blockchain quốc gia và Đề án CĐS của Đà Nẵng. Mục tiêu: tăng độ tin cậy của dữ liệu số.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="font-semibold text-dnc-blue-800 mb-1">⛓️ Làm cái gì?</p>
              <p className="text-sm text-gray-600">Xây hạ tầng blockchain dùng chung DNC-Chain làm &quot;lớp tin cậy số&quot;, cộng với 07 mô đun nền tảng và 10 sản phẩm ứng dụng theo 4 tầng cấp độ.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="font-semibold text-dnc-blue-800 mb-1">🛡️ Nguyên tắc cốt lõi</p>
              <p className="text-sm text-gray-600">Blockchain chỉ ghi &quot;bằng chứng xác minh&quot;, không lưu hồ sơ gốc. Triển khai theo cấp độ, đúng thẩm quyền, bảo đảm an toàn — an ninh mạng.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-4">Căn cứ pháp lý</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {legalBases.map(lb => (
            <div key={lb.id} className="card border-l-4 border-dnc-blue-500">
              <p className="text-xs font-bold text-dnc-blue-600 uppercase tracking-wide">{lb.id}</p>
              <p className="font-medium text-dnc-blue-900 text-sm mt-1">{lb.title}</p>
              <p className="text-xs text-gray-500 mt-1">{lb.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-2">Đích đến năm 2030</h2>
        <p className="text-gray-600 mb-4">Mục tiêu cụ thể của đề án</p>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-2xl mb-2">🏗️</p>
            <p className="font-semibold text-dnc-blue-900 text-sm">01 hạ tầng + 07 mô đun</p>
            <p className="text-xs text-gray-500 mt-1">Xây dựng & vận hành DNC-Chain, ưu tiên nền tảng Layer-1 của Việt Nam</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl mb-2">📦</p>
            <p className="font-semibold text-dnc-blue-900 text-sm">10 sản phẩm ứng dụng</p>
            <p className="text-xs text-gray-500 mt-1">Đến 2030, toàn bộ SP1→SP10 được triển khai theo đúng cấp độ</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl mb-2">👥</p>
            <p className="font-semibold text-dnc-blue-900 text-sm">≥ 1.000 nhân lực</p>
            <p className="text-xs text-gray-500 mt-1">Tối thiểu 1.000 nhân lực có kỹ năng blockchain</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl mb-2">🤝</p>
            <p className="font-semibold text-dnc-blue-900 text-sm">≥ 30 doanh nghiệp</p>
            <p className="text-xs text-gray-500 mt-1">Tham gia cung cấp giải pháp & triển khai nhiệm vụ đặt hàng</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-4">Mô hình kiến trúc — 5 lớp</h2>
        <p className="text-gray-600 mb-4">DNC-Chain là chuỗi khối lớp-1 có cấp phép (permissioned), công nghệ lõi Permissioned Ethereum.</p>
        <div className="space-y-3">
          {[
            { layer: '1', title: 'Hệ thống nguồn & cơ sở dữ liệu', desc: 'Các cơ quan tạo lập, lưu trữ, quản lý dữ liệu nghiệp vụ gốc — chịu trách nhiệm pháp lý về dữ liệu.', color: 'bg-gray-100 border-gray-300', arrow: '↓' },
            { layer: '2', title: 'Lớp tích hợp & chia sẻ dữ liệu (LGSP)', desc: 'Kết nối, điều phối, chia sẻ dữ liệu giữa các hệ thống qua nền tảng tích hợp của thành phố.', color: 'bg-blue-50 border-blue-200', arrow: '↓' },
            { layer: '3', title: 'Lớp dữ liệu & nền tảng lõi — DNC-Chain', desc: 'Ghi nhận bằng chứng xác minh, hỗ trợ kiểm chứng độc lập, truy vết & đối soát. Dư địa mở rộng lý thuyết 58.000-100.000 TPS.', color: 'bg-dnc-blue-100 border-dnc-blue-300', arrow: '↓' },
            { layer: '4', title: '07 mô đun nền tảng dùng chung', desc: 'Cầu nối đa chuỗi · Tạo & đối soát bằng chứng · Quản lý khóa & phân quyền · Quản lý giao dịch & token · Quản lý smart contract · Ứng dụng & marketplace · Hub làm sạch dữ liệu.', color: 'bg-purple-50 border-purple-200', arrow: '↓' },
            { layer: '5', title: 'Lớp ứng dụng & nghiệp vụ dùng chung', desc: '10 sản phẩm SP1-SP10 phục vụ xác minh dữ liệu, quản lý đô thị, kinh tế dữ liệu & tài chính số.', color: 'bg-green-50 border-green-200', arrow: null },
          ].map(l => (
            <div key={l.layer} className={`card border-2 ${l.color} relative`}>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center font-bold text-gray-600 shrink-0">
                  {l.layer}
                </div>
                <div>
                  <p className="font-semibold text-dnc-blue-900">{l.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{l.desc}</p>
                </div>
              </div>
              {l.arrow && <p className="text-center text-gray-400 text-xl mt-2">{l.arrow}</p>}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          💡 Blockchain chỉ ghi &quot;dấu vân tay&quot; (hash/bằng chứng) của hồ sơ, không lưu nội dung gốc. Khi cần kiểm tra, hệ thống đối chiếu dữ liệu hiện tại với bằng chứng đã ghi để khẳng định tính toàn vẹn — chống sửa, chống giả mạo.
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-2">10 sản phẩm theo 4 tầng cấp độ</h2>
        <p className="text-gray-600 mb-4">Triển khai theo thứ tự ưu tiên: tầng nào &quot;chín&quot; trước làm trước.</p>
        <div className="space-y-6">
          {tiers.map(tier => (
            <div key={tier.label} className="card border-l-4 border-dnc-blue-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-dnc-blue-900">{tier.label}</h3>
                <span className="text-xs bg-dnc-blue-100 text-dnc-blue-700 px-3 py-1 rounded-full font-medium">{tier.period}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {tier.products.map(p => (
                  <div key={p.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold bg-dnc-blue-600 text-white px-2 py-0.5 rounded">{p.id}</span>
                    </div>
                    <p className="font-medium text-dnc-blue-900 text-sm mb-1">{p.name}</p>
                    <p className="text-xs text-gray-600 mb-2">{p.desc}</p>
                    <p className="text-xs text-gray-400">🏛️ Chủ trì: {p.lead}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-2">Lộ trình triển khai</h2>
        <p className="text-gray-600 mb-4">Đi từng bước — không &quot;làm đồng loạt&quot;</p>
        <div className="space-y-4">
          {phases.map((phase, i) => (
            <div key={phase.period} className="card border-l-4 border-dnc-blue-600 relative">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-dnc-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  T{i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-dnc-blue-900">{phase.title}</h3>
                    <span className="text-xs text-gray-400">{phase.period}</span>
                  </div>
                  <p className="text-sm text-dnc-blue-600 font-medium mt-0.5">{phase.desc}</p>
                  <ul className="mt-2 space-y-1">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                        <span className="text-dnc-blue-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-4">Nguồn lực tài chính</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card text-center">
            <p className="text-5xl font-bold text-dnc-blue-700">268 tỷ</p>
            <p className="text-sm text-gray-500 mt-2">VNĐ · 2026-2030</p>
          </div>
          <div className="space-y-3">
            <div className="card bg-blue-50 border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dnc-blue-900">Ngân sách thành phố</p>
                  <p className="text-xs text-gray-600">Thể chế, hạ tầng DNC-Chain, dữ liệu/ATTT, sản phẩm Tầng 1&2</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-dnc-blue-700">182,49 tỷ</p>
                  <p className="text-xs text-gray-400">68,1%</p>
                </div>
              </div>
            </div>
            <div className="card bg-green-50 border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dnc-blue-900">Doanh nghiệp & nguồn khác</p>
                  <p className="text-xs text-gray-600">Hạ tầng kỹ thuật, vận hành thương mại SP6, SP7 và Tầng 4</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-700">85,51 tỷ</p>
                  <p className="text-xs text-gray-400">31,9%</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
              🏦 Với Tầng 4, ngân sách nhà nước chỉ chi cho quản lý, giám sát, tích hợp kỹ thuật, tuân thủ & quản trị rủi ro — không đầu tư phần thương mại của doanh nghiệp.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-4">Tổ chức thực hiện</h2>
        <p className="text-gray-600 mb-4">20 nhóm chủ thể. Sở Khoa học & Công nghệ là đầu mối chủ trì.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card border-l-4 border-dnc-blue-600">
            <p className="text-sm font-semibold text-dnc-blue-900">🧭 Sở Khoa học & Công nghệ</p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              <li>• Chủ trì phổ biến, hướng dẫn, triển khai toàn đề án</li>
              <li>• Chủ trì SP1, SP3, SP5, SP6, SP8</li>
              <li>• Vận hành hạ tầng DNC-Chain</li>
              <li>• Tổng hợp khó khăn, vướng mắc; tham mưu điều chỉnh</li>
            </ul>
          </div>
          <div className="card border-l-4 border-green-500">
            <p className="text-sm font-semibold text-dnc-blue-900">🏢 Các Sở chuyên ngành</p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              <li>• Sở GD&ĐT — chủ trì SP2 (văn bằng, chứng chỉ)</li>
              <li>• Sở Y tế — chủ trì SP4 (hồ sơ y tế)</li>
              <li>• Sở VH-TT&DL — chủ trì SP7 (City Loyalty)</li>
              <li>• Sở Tài chính — cân đối nguồn lực</li>
            </ul>
          </div>
          <div className="card border-l-4 border-amber-500">
            <p className="text-sm font-semibold text-dnc-blue-900">💹 Cơ quan điều hành IFC · NHNN KV9</p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              <li>• IFC Đà Nẵng chủ trì SP9, SP10</li>
              <li>• NHNN khu vực 9 giám sát rủi ro thanh toán</li>
              <li>• Công an TP — bảo đảm an ninh mạng, truy vết on-chain</li>
            </ul>
          </div>
          <div className="card border-l-4 border-purple-500 bg-purple-50/50">
            <p className="text-sm font-semibold text-dnc-blue-900">🏘️ UBND các phường, xã, đặc khu</p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              <li>• Tổ chức triển khai nhiệm vụ theo phân công</li>
              <li>• Rà soát, chuẩn hóa dữ liệu hệ thống nguồn</li>
              <li>• Phối hợp tích hợp, kiểm thử, vận hành</li>
              <li>• Định kỳ báo cáo kết quả về Sở KH&CN</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dnc-blue-900 mb-4">Rủi ro được quản lý</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {riskGroups.map(r => (
            <div key={r.label} className="card">
              <p className="font-semibold text-dnc-blue-900 mb-1">{r.icon} {r.label}</p>
              <p className="text-xs text-gray-600">{r.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="card border-2 border-amber-200 bg-amber-50/50">
          <h2 className="text-lg font-bold text-dnc-blue-900 mb-3">Góc nhìn chuyên viên CNTT-CĐS xã</h2>
          <p className="text-sm text-amber-800 font-medium mb-3">Việc này có phải của xã làm ngay không?</p>
          <div className="space-y-3 text-sm text-gray-700">
            <p>Phần lớn là việc của Sở KH&CN và các Sở ngành — không phải việc xã làm ngay. Toàn bộ 10 sản phẩm đều do Sở/cơ quan thành phố chủ trì. Giai đoạn đầu (2026-2027) chỉ chạy SP1, SP2 do Sở KH&CN và Sở GD&ĐT cầm. Cấp xã chỉ xuất hiện ở vai trò phối hợp, rõ nhất là SP3 (Digital Twin) tại khu vực thí điểm — thuộc Tầng 2, giai đoạn 2028-2030.</p>
            <div className="bg-white rounded-xl p-4 border border-amber-100">
              <p className="font-semibold text-green-700 mb-2">✅ Việc nên làm bây giờ (nhẹ, đúng vai)</p>
              <ul className="space-y-1 text-gray-600">
                <li>• Đọc & nắm tinh thần đề án, lưu hồ sơ để tra cứu</li>
                <li>• Tham mưu lãnh đạo xã: ghi nhận, theo dõi — chưa phát sinh nhiệm vụ/kinh phí riêng cho xã</li>
                <li>• Rà soát sơ bộ chất lượng dữ liệu nghiệp vụ của xã để sẵn sàng khi có yêu cầu</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-100">
              <p className="font-semibold text-amber-700 mb-2">⏳ Chỉ phát sinh khi có yêu cầu cụ thể</p>
              <ul className="space-y-1 text-gray-600">
                <li>• Bố trí đầu mối phối hợp khi Sở KH&CN triển khai tích hợp dữ liệu nguồn</li>
                <li>• Chuẩn hóa dữ liệu hệ thống nguồn để kết nối DNC-Chain</li>
                <li>• Tham gia nếu xã nằm trong khu vực thí điểm SP3 giai đoạn 2028-2030</li>
              </ul>
            </div>
            <div className="bg-dnc-blue-50 rounded-xl p-4 border border-dnc-blue-100 text-dnc-blue-800 font-medium">
              📌 Kết luận: Với văn bản 2728, việc của xã hiện nay là tham mưu để theo dõi — không có đầu việc bắt buộc phải xử lý trước hạn 29/6/2026 ngoài việc nắm nội dung & báo cáo lãnh đạo. Các nghĩa vụ thực chất (chuẩn hóa dữ liệu, phối hợp tích hợp) chỉ kích hoạt khi thành phố/Sở KH&CN có kế hoạch & hướng dẫn cụ thể.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DeAnPageWrapper() {
  return (
    <PublicLayout>
      <DeAnPage />
    </PublicLayout>
  );
}
