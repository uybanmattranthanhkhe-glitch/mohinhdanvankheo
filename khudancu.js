// ================= DANH SÁCH KHU DAN CU =================
// DANH SÁCH 80 KHU DÂN CƯ PHƯỜNG THANH KHÊ
const DS_KHU_DAN_CU_GS = [
  "1 TAM THUẬN", "2 TAM THUẬN", "3 TAM THUẬN", "4 TAM THUẬN", "5 TAM THUẬN",
  "6 TAM THUẬN", "7 TAM THUẬN", "8 TAM THUẬN", "9 TAM THUẬN", "10 TÂN CHÍNH",
  "11 TÂN CHÍNH", "12 TÂN CHÍNH", "13 TÂN CHÍNH", "14 TÂN CHÍNH", "15 TÂN CHÍNH",
  "16 VĨNH TRUNG", "17 VĨNH TRUNG", "18 VĨNH TRUNG", "19 VĨNH TRUNG", "20 VĨNH TRUNG",
  "21 VĨNH TRUNG", "22 VĨNH TRUNG", "23 THẠC GIÁN", "24 THẠC GIÁN", "25 THẠC GIÁN",
  "26 THẠC GIÁN", "27 THẠC GIÁN", "28 THẠC GIÁN", "29 THẠC GIÁN", "30 THẠC GIÁN",
  "31 THẠC GIÁN", "32 XUÂN HÀ", "33 XUÂN HÀ", "34 XUÂN HÀ", "35 XUÂN HÀ",
  "36 XUÂN HÀ", "37 XUÂN HÀ", "38 XUÂN HÀ", "39 XUÂN HÀ", "40 CHÍNH GIÁN",
  "41 CHÍNH GIÁN", "42 CHÍNH GIÁN", "43 CHÍNH GIÁN", "44 CHÍNH GIÁN", "45 CHÍNH GIÁN",
  "46 CHÍNH GIÁN", "47 CHÍNH GIÁN", "48 CHÍNH GIÁN", "49 THANH KHÊ ĐÔNG", "50 THANH KHÊ ĐÔNG",
  "51 THANH KHÊ ĐÔNG", "52 THANH KHÊ ĐÔNG", "53 THANH KHÊ ĐÔNG", "54 HÒA KHÊ", "55 HÒA KHÊ",
  "56 HÒA KHÊ", "57 HÒA KHÊ", "58 HÒA KHÊ", "59 HÒA KHÊ", "60 HÒA KHÊ",
  "61 HÒA KHÊ", "62 HÒA KHÊ", "63 HÒA KHÊ", "64 HÒA KHÊ", "65 THANH KHÊ TÂY",
  "66 THANH KHÊ TÂY", "67 THANH KHÊ TÂY", "68 THANH KHÊ TÂY", "69 THANH KHÊ TÂY", "70 THANH KHÊ TÂY",
  "71 THANH KHÊ TÂY", "72 THANH KHÊ TÂY", "73 THANH KHÊ TÂY", "74 THANH KHÊ TÂY", "75 THANH KHÊ TÂY",
  "76 THANH KHÊ TÂY", "77 THANH KHÊ TÂY", "78 THANH KHÊ TÂY", "79 THANH KHÊ TÂY", "80 THANH KHÊ TÂY"
];

// ================= HÀM TIỆN ÍCH =================

// Chuẩn hóa tên khu dân cư (bỏ dấu, viết hoa)
function normalizeCode(str) {
  const map = {
    'á':'a','à':'a','ả':'a','ã':'a','ạ':'a',
    'ă':'a','ắ':'a','ằ':'a','ẳ':'a','ẵ':'a','ặ':'a',
    'â':'a','ấ':'a','ầ':'a','ẩ':'a','ẫ':'a','ậ':'a',
    'đ':'d','é':'e','è':'e','ẻ':'e','ẽ':'e','ẹ':'e',
    'ê':'e','ế':'e','ề':'e','ể':'e','ễ':'e','ệ':'e',
    'í':'i','ì':'i','ỉ':'i','ĩ':'i','ị':'i',
    'ó':'o','ò':'o','ỏ':'o','õ':'o','ọ':'o',
    'ô':'o','ố':'o','ồ':'o','ổ':'o','ỗ':'o','ộ':'o',
    'ơ':'o','ớ':'o','ờ':'o','ở':'o','ỡ':'o','ợ':'o',
    'ú':'u','ù':'u','ủ':'u','ũ':'u','ụ':'u',
    'ư':'u','ứ':'u','ừ':'u','ử':'u','ữ':'u','ự':'u',
    'ý':'y','ỳ':'y','ỷ':'y','ỹ':'y','ỵ':'y'
  };
  
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const lowerChar = char.toLowerCase();
    if (map[lowerChar]) {
      result += map[lowerChar];
    } else if (/[a-z0-9]/i.test(char)) {
      result += char.toLowerCase();
    }
  }
  return result.toUpperCase();
}

// Tạo dropdown khu dân cư
function createKhuDanCuSelect(selectElementId, defaultKhuDanCu = "") {
  const select = document.getElementById(selectElementId);
  if (!select) return;
  
  select.innerHTML = '<option value="">-- Chọn khu dân cư --</option>';
  
  // Sắp xếp danh sách (số trước, chữ sau)
  const sortedList = [...DS_KHU_DAN_CU_GS].sort((a, b) => {
    const aMatch = a.match(/^(\d+)?\s*(.*)/);
    const bMatch = b.match(/^(\d+)?\s*(.*)/);
    const aNum = aMatch[1] ? parseInt(aMatch[1]) : Infinity;
    const bNum = bMatch[1] ? parseInt(bMatch[1]) : Infinity;
    
    if (aNum !== bNum) return aNum - bNum;
    return aMatch[2].localeCompare(bMatch[2]);
  });
  
  sortedList.forEach(khuDanCu => {
    const option = document.createElement('option');
    option.value = khuDanCu;
    option.textContent = khuDanCu;
    if (khuDanCu === defaultKhuDanCu) option.selected = true;
    select.appendChild(option);
  });
}

// Tạo tên file tự động
function generateFileName(khuDanCu, month, year) {
  const normalized = normalizeCode(khuDanCu);
  return `DDK_${normalized}_T${month}_${year}.docx`;
}

// Lấy tháng năm hiện tại
function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
}

// Kiểm tra khu dân cư có hợp lệ không
function isValidKhuDanCu(khuDanCu) {
  return DS_KHU_DAN_CU_GS.includes(khuDanCu);
}

// Tìm khu dân cư gợi ý (khi nhập sai)
function findSimilarKhuDanCu(inputKhuDanCu) {
  if (!inputKhuDanCu) return [];
  
  const normalizedInput = normalizeCode(inputKhuDanCu);
  const suggestions = [];
  
  for (const khuDanCu of DS_KHU_DAN_CU_GS) {
    const normalizedKhuDanCu = normalizeCode(khuDanCu);
    
    if (normalizedKhuDanCu.includes(normalizedInput) || 
        normalizedInput.includes(normalizedKhuDanCu)) {
      suggestions.push(khuDanCu);
    }
    
    if (suggestions.length >= 5) break;
  }
  
  return suggestions;
}

// Export các hàm để sử dụng (nếu dùng module)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DS_KHU_DAN_CU_GS,
    normalizeCode,
    createKhuDanCuSelect,
    generateFileName,
    getCurrentMonthYear,
    isValidKhuDanCu,
    findSimilarKhuDanCu
  };
}