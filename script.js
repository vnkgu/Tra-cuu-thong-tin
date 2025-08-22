async function searchByColumnB() {
  const input = document.getElementById('cccd').value.trim();
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = '';

  if (!input) {
    alert("Vui lòng nhập số ĐĐCN");
    return;
  }

  try {
    const res = await fetch('data.csv');
    if (!res.ok) throw new Error("Không thể tải file CSV");
    let text = await res.text();
    text = text.replace(/^\uFEFF/, '');           // Loại bỏ BOM nếu có

    // Tách dòng, bỏ các dòng trống
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

    const results = [];
    // Bỏ qua dòng tiêu đề (index 0), bắt đầu từ dòng data
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      // cols[1] chính là cột B (Số ĐĐCN)
      if (cols[1] && cols[1].trim() === input) {
        results.push(cols.map(c => c.trim()));
      }
    }

    if (results.length === 0) {
      tbody.innerHTML = 
        '<tr><td colspan="' + lines[0].split(',').length + '" style="text-align:center;">Không tìm thấy dữ liệu</td></tr>';
      return;
    }

    // Đổ kết quả ra bảng
    results.forEach((cols, idx) => {
      const tr = document.createElement('tr');
      // STT
      tr.innerHTML = `<td>${idx + 1}</td>` +
        cols.map(c => `<td>${c}</td>`).join('');
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = 
      '<tr><td colspan="100%" style="text-align:center;color:red;">Có lỗi khi tải dữ liệu</td></tr>';
  }
}
