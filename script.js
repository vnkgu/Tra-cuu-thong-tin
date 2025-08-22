document.getElementById('searchBtn').addEventListener('click', searchStudent);

function searchStudent() {
  const cccdInput = document.getElementById('cccdInput').value.trim();
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = '';

  if (!cccdInput) {
    alert('Vui lòng nhập số ĐDCN');
    return;
  }

  Papa.parse('data.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    beforeFirstChunk: chunk => chunk.replace(/^\uFEFF/, ''), // bỏ BOM nếu có
    complete: function(results) {
      const data = results.data.map(row => {
        const clean = {};
        Object.keys(row).forEach(k => {
          clean[k.trim()] = row[k] ? row[k].trim() : '';
        });
        return clean;
      });

      const matches = data.filter(row => row['Số căn cước công dân'] === cccdInput);

      if (matches.length === 0) {
        tbody.innerHTML = `<tr>
          <td colspan="8" style="text-align:center;color:red;">Không tìm thấy dữ liệu</td>
        </tr>`;
        return;
      }

      matches.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row['STT']}</td>
          <td>${row['Số căn cước công dân']}</td>
          <td>${row['Họ và tên']}</td>
          <td>${row['Ngày sinh']}</td>
          <td>${row['Giới tính']}</td>
          <td>${row['Ngành trúng tuyển']}</td>
          <td>${row['Mã số sinh viên']}</td>
          <td>${row['Mã lớp']}</td>
        `;
        tbody.appendChild(tr);
      });
    },
    error: function(err) {
      console.error(err);
      tbody.innerHTML = `<tr>
        <td colspan="8" style="text-align:center;color:red;">Lỗi khi tải dữ liệu</td>
      </tr>`;
    }
  });
}
