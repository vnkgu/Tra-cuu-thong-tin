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

    const results = rows.slice(1).filter(cols => {
      const soDDCN = cols[2] ? cols[2].trim() : ''; // cột CCCD
      return soDDCN === cccdInput;
    });

    if (results.length === 0) {
      tbody.innerHTML = '<tr><td colspan="17" style="text-align:center;">Không tìm thấy dữ liệu</td></tr>';
      return;
    }

    results.forEach((cols, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${cols[2] || ''}</td>
        <td>${cols[3] || ''}</td>
        <td>${cols[4] || ''}</td>
        <td>${cols[5] || ''}</td>
        <td>${cols[6] || ''}</td>
        <td>${cols[7] || ''}</td>
        <td>${cols[8] || ''}</td>
        <td>${cols[9] || ''}</td>
        <td>${cols[10] || ''}</td>
        <td>${cols[11] || ''}</td>
        <td>${cols[12] || ''}</td>
        <td>${cols[13] || ''}</td>
        <td>${cols[14] || ''}</td>
        <td>${cols[15] || ''}</td>
        <td>${cols[16] || ''}</td>
        <td>${cols[17] || ''}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="17" style="text-align:center;color:red;">Có lỗi khi tải dữ liệu</td></tr>';
  }
}
