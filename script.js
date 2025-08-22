async function searchStudent() {
  const cccdInput = document.getElementById('cccd').value.trim();
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = '';

  if (!cccdInput) {
    alert("Vui lòng nhập số CCCD/CMND");
    return;
  }

  try {
    const res = await fetch('data.csv');
    if (!res.ok) throw new Error("Không thể tải dữ liệu");

    let text = await res.text();
    text = text.replace(/^\uFEFF/, ''); // bỏ BOM

    const rows = text.trim().split('\n').map(r => r.split(','));

    // Xác định vị trí cột "Số ĐĐCN"
    const headers = rows[0].map(h => h.trim());
    const cccdIndex = headers.findIndex(h => h.toLowerCase().includes('đđcn'));

    if (cccdIndex === -1) {
      alert("Không tìm thấy cột Số ĐĐCN trong file CSV");
      return;
    }

    // Lọc dữ liệu
    const results = rows.slice(1).filter(cols => {
      const soDDCN = cols[cccdIndex] ? cols[cccdIndex].trim() : '';
      return soDDCN === cccdInput;
    });

    if (results.length === 0) {
      tbody.innerHTML = '<tr><td colspan="' + headers.length + '" style="text-align:center;">Không tìm thấy dữ liệu</td></tr>';
      return;
    }

    // Hiển thị kết quả
    results.forEach((cols, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${index + 1}</td>` + cols.map(c => `<td>${c || ''}</td>`).join('');
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="17" style="text-align:center;color:red;">Có lỗi khi tải dữ liệu</td></tr>';
  }
}
