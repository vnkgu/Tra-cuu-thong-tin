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
    beforeFirstChunk: chunk => chunk.replace(/^\uFEFF/, ''), // bỏ BOM
    complete: function(results) {
      // Chuẩn hóa key và value: trim khoảng trắng
      const data = results.data.map(row => {
        const clean = {};
        Object.keys(row).forEach(k => {
          clean[k.trim()] = row[k] ? row[k].trim() : '';
        });
        return clean;
      });

      // Lọc theo cột "Số ĐDCN"
      const matches = data.filter(row => row['Số ĐDCN'] === cccdInput);

      if (matches.length === 0) {
        tbody.innerHTML = `<tr>
          <td colspan="${Object.keys(data[0] || {}).length}" style="text-align:center;color:red;">
            Không tìm thấy dữ liệu
          </td>
        </tr>`;
        return;
      }

      // Render kết quả
      matches.forEach((row, i) => {
        const cells = [
          i + 1,
          row['STT'],
          row['Số ĐDCN'],
          row['Họ và tên'],
          row['Ngày sinh'],
          row['Giới tính'],
          row['Ngành trúng tuyển'] || '',
          row['Mã số sinh viên'] || '',
          row['Mã lớp'] || ''
        ];

        const tr = document.createElement('tr');
        tr.innerHTML = cells.map(c => `<td>${c}</td>`).join('');
        tbody.appendChild(tr);
      });
    },
    error: function(err) {
      console.error(err);
      tbody.innerHTML = `<tr>
        <td colspan="8" style="text-align:center;color:red;">
          Lỗi khi tải dữ liệu
        </td>
      </tr>`;
    }
  });
}

