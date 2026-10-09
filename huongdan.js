(function () {
  'use strict';

  if (typeof window.openHuongDanModal === 'function') return;

  // 1. Inject CSS
  if (!document.getElementById('huongdan-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'huongdan-modal-styles';
    style.textContent = `
      .hd-modal {
        display: none !important;
        position: fixed;
        inset: 0;
        z-index: 100001;
        background: rgba(18, 38, 63, 0.55);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        animation: hdFadeIn .25s ease;
      }
      .hd-modal.open { display: flex !important; }
      @keyframes hdFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes hdSlideUp {
        from { transform: translateY(20px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }

      .hd-dialog {
        position: relative;
        flex: 1 1 auto;
        margin: 14px;
        background: #F2F8FE;
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: hdSlideUp .3s ease;
        max-height: calc(100vh - 28px);
        font-family: 'Inter', 'Segoe UI', 'Noto Sans', system-ui, sans-serif;
      }

      /* ===== HEADER ===== */
      .hd-header {
        flex: 0 0 auto;
        background: linear-gradient(135deg, #0D5FB8, #1E88E5);
        color: #fff;
        padding: 12px 12px 12px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 58px;                /* ⬅️ đảm bảo không bị co lại */
        box-shadow: 0 2px 10px rgba(0,0,0,0.22);
        z-index: 6;
      }
      .hd-header-title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 1.02rem;
        font-weight: 700;
        letter-spacing: .3px;
        line-height: 1.55;               /* ⬅️ chừa chỗ cho dấu tiếng Việt */
        padding: 4px 0;                  /* ⬅️ đệm dọc để không cắt dấu */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
      .hd-close {
        width: 36px; height: 36px;
        padding: 0;
        border-radius: 50%;
        border: 1.5px solid rgba(255,255,255,.75);
        background: rgba(255,255,255,.12);
        color: #fff;
        font-size: 1.05rem;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        transition: .2s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .hd-close:hover { background: rgba(255,255,255,.3); transform: rotate(90deg); }

      /* ===== BODY ===== */
      .hd-body {
        flex: 1 1 auto;
        position: relative;
        overflow: hidden;
        min-height: 0;
      }
      .hd-content {
        position: absolute;
        inset: 0;
        padding: 20px 22px 24px;
        overflow-y: auto;
        scroll-behavior: smooth;
        color: #12263F;
        line-height: 1.7;
        font-size: 15px;
        -webkit-overflow-scrolling: touch;
      }
      .hd-content::-webkit-scrollbar { width: 10px; }
      .hd-content::-webkit-scrollbar-thumb { background: #90CAF9; border-radius: 5px; }
      .hd-content::-webkit-scrollbar-track { background: #F2F8FE; }
      .hd-inner { max-width: 900px; margin: 0 auto; }

      .hd-part {
        margin-bottom: 20px;
        padding: 16px 20px;
        background: #fff;
        border-radius: 12px;
        border: 1px solid #CFE3F5;
        box-shadow: 0 2px 8px rgba(30,136,229,0.1);
      }
      .hd-part-title {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #0D5FB8;
        font-size: 1.05rem;
        font-weight: 700;
        margin: 0 0 12px;
        padding-bottom: 10px;
        border-bottom: 2px dashed #A9CCEB;
        text-transform: uppercase;
        letter-spacing: .3px;
        line-height: 1.5;                /* ⬅️ tránh cắt dấu ở tiêu đề phần */
      }
      .hd-part-title .hd-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px; height: 30px;
        background: linear-gradient(135deg, #0D5FB8, #29B6F6);
        color: #fff;
        border-radius: 50%;
        font-size: .85rem;
        flex-shrink: 0;
      }
      .hd-content h3 {
        font-size: .98rem;
        color: #0D5FB8;
        margin: 16px 0 6px;
        line-height: 1.5;                /* ⬅️ chừa chỗ cho dấu */
      }
      .hd-content p { margin: 6px 0; }
      .hd-content ul, .hd-content ol { margin: 6px 0; padding-left: 22px; }
      .hd-content li { margin-bottom: 6px; }
      .hd-content li::marker { color: #1E88E5; font-weight: 700; }
      .hd-content .hd-hl {
        background: #E3F2FD;
        color: #0D5FB8;
        padding: 1px 6px;
        border-radius: 3px;
        font-weight: 600;
      }

      .hd-steps { list-style: none; padding: 0 !important; margin: 0; display: grid; gap: 10px; counter-reset: hdst; }
      .hd-steps li {
        counter-increment: hdst;
        position: relative;
        padding: 2px 0 2px 38px;
        margin: 0;
        line-height: 1.65;               /* ⬅️ thoáng hơn cho dấu tiếng Việt */
      }
      .hd-steps li::before {
        content: counter(hdst);
        position: absolute; left: 0; top: 0;
        width: 26px; height: 26px; border-radius: 50%;
        background: linear-gradient(90deg, #1E88E5, #29B6F6);
        color: #fff; font-weight: 700; font-size: 13px;
        display: flex; align-items: center; justify-content: center;
      }
      .hd-tip {
        margin-top: 14px;
        padding: 12px 14px;
        background: #EAF4FD;
        border: 1px dashed #A9CCEB;
        border-radius: 10px;
        font-size: .92rem;
      }
      .hd-doc p { text-align: justify; }
      .hd-doc .hd-item {
        margin: 8px 0;
        padding: 8px 12px;
        background: #F3F9FE;
        border-left: 1px solid #1E88E5;
        border-right: 1px solid #1E88E5;
        border-radius: 6px;
      }
      .hd-doc .hd-note {
        margin-top: 12px;
        padding: 12px 14px;
        background: #FFF8E1;
        border: 1px solid #F0D98A;
        border-radius: 10px;
      }

      /* ===== FOOTER ===== */
      .hd-footer {
        flex: 0 0 auto;
        padding: 8px 16px;
        background: #EAF4FD;
        border-top: 1px solid #CFE3F5;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 -2px 10px rgba(0,0,0,.05);
        z-index: 6;
      }
      .hd-ok-btn {
        padding: 10px 34px;
        background: linear-gradient(135deg, #0D5FB8, #1E88E5);
        color: #fff;
        border: none;
        border-radius: 30px;
        font-size: .92rem;
        font-weight: 700;
        letter-spacing: .5px;
        cursor: pointer;
        transition: .25s;
        box-shadow: 0 4px 12px rgba(13,95,184,0.3);
      }
      .hd-ok-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(13,95,184,0.45); }
      .hd-ok-btn:active { transform: translateY(0); }

      @media (max-width: 700px) {
        .hd-dialog { margin: 0; border-radius: 0; max-height: 100vh; }
        .hd-header { padding: 10px 10px 10px 14px; min-height: 52px; }
        .hd-header-title {
          font-size: .92rem;
          line-height: 1.5;
          padding: 3px 0;
        }
        .hd-close { width: 34px; height: 34px; }
        .hd-content { padding: 14px 12px 20px; font-size: 14px; }
        .hd-part { padding: 12px 14px; }
        .hd-part-title { font-size: .95rem; line-height: 1.5; }
        .hd-footer { padding: 6px 12px; }
        .hd-ok-btn { padding: 9px 26px; font-size: .85rem; }
      }
    `;
    document.head.appendChild(style);
  }

  // 2. Tạo HTML modal
  function buildModal() {
    if (document.getElementById('hdModal')) return;

    const modal = document.createElement('div');
    modal.id = 'hdModal';
    modal.className = 'hd-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Hướng dẫn đăng ký mô hình');

    modal.innerHTML = `
      <div class="hd-dialog">

        <div class="hd-header">
          <div class="hd-header-title">📖 HƯỚNG DẪN ĐĂNG KÝ MÔ HÌNH</div>
          <button type="button" class="hd-close" id="hdCloseBtn" aria-label="Đóng">✕</button>
        </div>

        <div class="hd-body">
          <div class="hd-content" id="hdContent">
            <div class="hd-inner">

              <!-- ===== PHẦN TRÊN: HƯỚNG DẪN THAO TÁC ===== -->
              <div class="hd-part">
                <h2 class="hd-part-title"><span class="hd-badge">1</span>Cách thao tác</h2>
                <ol class="hd-steps">
                  <li><b>Chọn đơn vị đăng ký:</b> “Khu dân cư” (chọn trong danh sách) hoặc “Cơ quan, trường học, đơn vị khác” (tự nhập tên đơn vị).</li>
                  <li><b>Điền đủ 9 mục</b> của mô hình. Tất cả đều bắt buộc; nếu thiếu, hệ thống sẽ báo và đưa con trỏ về ô còn trống.</li>
                  <li><b>Bấm “Gửi đăng ký”</b> và chờ thông báo màu xanh là thành công (không bấm gửi nhiều lần).</li>
                  <li><b>Kiểm tra lại</b> ở tab “Danh sách đã đăng ký”: chạm vào tên đơn vị để xem chi tiết; bấm “Làm mới” để cập nhật hoặc “Tải Excel” để lưu về máy.</li>
                </ol>
                <div class="hd-tip">
                  💡 <b>Mẹo:</b> kéo góc dưới bên phải của mỗi ô nhập để phóng to / thu nhỏ khi cần kiểm tra nội dung. Nhấn <b>Enter</b> để xuống dòng. Nếu báo lỗi khi gửi, kiểm tra kết nối mạng rồi thử lại; nội dung trong form vẫn được giữ nguyên.
                </div>
              </div>

              <!-- ===== PHẦN DƯỚI: NỘI DUNG VĂN BẢN ===== -->
              <div class="hd-part hd-doc">
                <h2 class="hd-part-title"><span class="hd-badge">2</span>Nội dung văn bản Số: 249/MTTQ-BTT <br> của BAN THƯỜNG TRỰC ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM
               PHƯỜNG THANH KHÊ</h2>

                <p>Thực hiện chủ trương của Đảng về tăng cường sự lãnh đạo đối với công tác dân vận trong tình hình mới và nhiệm vụ tham mưu, theo dõi, tổng hợp, đôn đốc, phối hợp triển khai công tác dân vận trên địa bàn, Ban Thường trực Ủy ban MTTQ Việt Nam phường Thanh Khê kính đề nghị các cơ quan, đơn vị, Chi bộ trường học, Chi bộ khu dân cư phối hợp rà soát, đăng ký các mô hình dân vận đang thực hiện và dự kiến triển khai trong thời gian đến.</p>
                <p>Việc rà soát, đăng ký nhằm hệ thống hóa các mô hình, cách làm hay, hiệu quả; phát hiện, xây dựng và nhân rộng các mô hình phù hợp thực tiễn, phát huy vai trò của cả hệ thống chính trị và Nhân dân. Trên cơ sở đó, Ban Thường trực Ủy ban MTTQ Việt Nam phường tổng hợp danh mục mô hình dân vận trên địa bàn, làm cơ sở theo dõi, đánh giá, tham mưu biểu dương, nhân rộng và lựa chọn một số mô hình tiêu biểu ra mắt trong chuỗi hoạt động chào mừng Ngày hội Đại đoàn kết toàn dân tộc và kỷ niệm 96 năm Ngày truyền thống MTTQ Việt Nam (18/11/1930 - 18/11/2026).</p>
                <p>Ban Thường trực Ủy ban MTTQ Việt Nam phường kính đề nghị các cơ quan, đơn vị và các Chi bộ quan tâm phối hợp thực hiện một số nội dung sau:</p>

                <h3>1. Rà soát, cung cấp thông tin các mô hình đang thực hiện</h3>
                <p>Rà soát, thống kê các mô hình, cách làm hay, sáng tạo, hiệu quả về công tác dân vận đã và đang được triển khai tại cơ quan, đơn vị, khu dân cư, trường học; nhất là những mô hình có sự phối hợp giữa chính quyền, lực lượng vũ trang, Mặt trận, các tổ chức chính trị - xã hội và Nhân dân.</p>
                <p>Đối với các mô hình đang thực hiện, đề nghị đánh giá khái quát mục tiêu, nội dung, kết quả đạt được, hiệu quả thực tế, lực lượng tham gia và khả năng duy trì, nhân rộng.</p>

                <h3>2. Đăng ký xây dựng mô hình mới</h3>
                <p>Khuyến khích các cơ quan, đơn vị, khu dân cư, trường học đăng ký xây dựng các mô hình dân vận mới hoặc tiếp tục hoàn thiện, nâng chất lượng các mô hình đang thực hiện nhưng chưa được đăng ký, hệ thống hóa thành mô hình cụ thể.</p>
                <p>Việc lựa chọn nội dung mô hình cần xuất phát từ yêu cầu thực tiễn, những vấn đề Nhân dân quan tâm, những nhiệm vụ trọng tâm của địa phương, cơ quan, đơn vị; bảo đảm thiết thực, cụ thể, dễ thực hiện, có tiêu chí đánh giá và có sản phẩm, kết quả đầu ra rõ ràng.</p>

                <h3>3. Nội dung đăng ký mô hình</h3>
                <p>Để thống nhất việc tổng hợp, theo dõi và đánh giá, đề nghị mỗi mô hình đăng ký thể hiện rõ các nội dung:</p>
                <div class="hd-item"><b>Tên mô hình:</b> ngắn gọn, dễ nhớ, phản ánh rõ nội dung, mục tiêu của mô hình.</div>
                <div class="hd-item"><b>Thực trạng, lý do xây dựng mô hình:</b> vấn đề thực tế cần tập trung giải quyết.</div>
                <div class="hd-item"><b>Mục tiêu, tiêu chí:</b> xác định rõ mục tiêu và các tiêu chí cụ thể để đánh giá kết quả.</div>
                <div class="hd-item"><b>Nội dung, cách thức thực hiện:</b> các hoạt động, giải pháp và phương thức vận động, tổ chức thực hiện.</div>
                <div class="hd-item"><b>Địa bàn, đối tượng:</b> xác định cụ thể phạm vi, đối tượng thụ hưởng hoặc tham gia.</div>
                <div class="hd-item"><b>Lực lượng thực hiện:</b> lực lượng chủ trì, phối hợp và lực lượng tham gia; trong đó xác định rõ vai trò của từng lực lượng.</div>
                <div class="hd-item"><b>Nguồn lực thực hiện:</b> kinh phí, cơ sở vật chất, phương tiện, nhân lực, ngày công, nguồn xã hội hóa và các nguồn lực khác.</div>
                <div class="hd-item"><b>Thời gian thực hiện:</b> thời gian bắt đầu, tiến độ và thời điểm đánh giá kết quả.</div>
                <div class="hd-item"><b>Sản phẩm, kết quả đầu ra:</b> xác định những kết quả cụ thể, có thể kiểm chứng.</div>
                <div class="hd-item"><b>Khả năng duy trì, nhân rộng:</b> đánh giá khả năng duy trì thường xuyên và nhân rộng mô hình.</div>
                <p class="hd-tip" style="margin-top:10px;">Trong biểu mẫu trực tuyến, <b>Nguồn lực</b> và <b>Thời gian thực hiện</b> được nhập chung trong một ô (mục 7).</p>

                <div class="hd-note">
                  <p style="margin-top:0;"><b>Riêng đối với các Chi bộ khu dân cư:</b> khi rà soát, đăng ký mô hình cần xác định rõ mô hình dân vận khéo của Chi bộ không đồng nhất với các phong trào, cuộc vận động, mô hình hoặc hoạt động do Ban Công tác Mặt trận, các chi hội đoàn thể, tổ dân phố hoặc các tổ chức, lực lượng khác tại khu dân cư chủ trì thực hiện.</p>
                  <p style="margin-bottom:0;">Mô hình dân vận khéo của Chi bộ phải xuất phát từ một vấn đề cụ thể, thiết thực của khu dân cư cần tập trung giải quyết, thể hiện rõ vai trò lãnh đạo của Chi bộ trong việc xác định nội dung, định hướng cách làm, tuyên truyền, vận động và huy động sự tham gia của các lực lượng trong hệ thống chính trị và Nhân dân.</p>
                </div>

                <h3>4. Tổ chức ra mắt và theo dõi mô hình</h3>
                <p>Trên cơ sở các mô hình được đăng ký, Ban Thường trực Ủy ban MTTQ Việt Nam phường sẽ tổng hợp, phối hợp với các cơ quan, đơn vị liên quan lựa chọn một số mô hình tiêu biểu, thiết thực, có tính sáng tạo, khả thi và có sức lan tỏa để tổ chức ra mắt trong chuỗi các hoạt động chào mừng Ngày hội Đại đoàn kết toàn dân tộc và kỷ niệm 96 năm Ngày truyền thống MTTQ Việt Nam.</p>
                <p>Việc tổ chức ra mắt mô hình thực hiện theo hướng thiết thực, ngắn gọn, có nội dung cam kết, phân công trách nhiệm và xác định sản phẩm cụ thể, tránh hình thức.</p>
                <p>Sau khi mô hình được triển khai, Ban Thường trực Ủy ban MTTQ Việt Nam phường phối hợp với các cơ quan, đơn vị liên quan theo dõi, tổng hợp kết quả; kịp thời tuyên truyền, tham mưu Đảng ủy biểu dương các mô hình hiệu quả, đồng thời đề xuất nhân rộng những cách làm hay, sáng tạo trên địa bàn.</p>

                <h3>5. Thời gian thực hiện</h3>
                <p>Đề nghị các cơ quan, đơn vị, Chi bộ khu dân cư, Chi bộ trường học quan tâm chỉ đạo, phối hợp rà soát và gửi danh sách, nội dung đăng ký mô hình về Ban Thường trực Ủy ban MTTQ Việt Nam phường <span class="hd-hl">trước ngày 25/10/2026</span> để tổng hợp, lựa chọn và xây dựng kế hoạch tổ chức ra mắt.</p>
                <p>Ban Thường trực Ủy ban MTTQ Việt Nam phường Thanh Khê kính đề nghị các cơ quan, đơn vị, Chi bộ khu dân cư, Chi bộ trường học quan tâm phối hợp thực hiện; phát huy tinh thần chủ động, sáng tạo, trách nhiệm trong công tác dân vận, góp phần tạo sự đồng thuận xã hội, củng cố khối đại đoàn kết toàn dân tộc và thực hiện thắng lợi các nhiệm vụ chính trị của địa phương.</p>
              </div>

            </div>
          </div>
        </div>

        <div class="hd-footer">
          <button type="button" class="hd-ok-btn" id="hdOkBtn">✓ ĐÃ HIỂU</button>
        </div>

      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('hdCloseBtn').addEventListener('click', closeHuongDanModal);
    document.getElementById('hdOkBtn').addEventListener('click', closeHuongDanModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeHuongDanModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeHuongDanModal();
    });
  }

  // 3. Mở / đóng modal
  function openHuongDanModal() {
    buildModal();
    const modal = document.getElementById('hdModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const content = document.getElementById('hdContent');
    if (content) content.scrollTop = 0;
  }

  function closeHuongDanModal() {
    const modal = document.getElementById('hdModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openHuongDanModal  = openHuongDanModal;
  window.closeHuongDanModal = closeHuongDanModal;

  // 4. Tự gắn sự kiện cho nút có class .huongdan-link
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.huongdan-link').forEach(el => {
      if (!el.getAttribute('onclick')) el.addEventListener('click', openHuongDanModal);
    });
  });
})();