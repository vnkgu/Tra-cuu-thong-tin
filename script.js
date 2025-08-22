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
    // loại bỏ BOM trước khi parse
    beforeFirstChunk: (chunk) => chunk.replace(/^\uFEFF/, ''),
    complete: function(results) {
      // Chuẩn hóa key và value: trim
      const data = results.data.map(row => {
        const clean = {};
        Object.keys(row).forEach(k => {
          const key = k.trim();
          clean[key] = row[k] != null ? row[k].trim() : '';
        });
        return clean;
      });

      // Lọc theo cột "Số ĐDCN"
      const matches = data.filter(row => row['Số ĐDCN'] === cccdInput);

      if (matches.length === 0) {
        tbody.innerHTML = `<tr>
          <td colspan="${Object.keys(data[0]||{}).length+1}" 
              style="text-align:center;color:red;">
            Không tìm thấy dữ liệu
          </td>
        </tr>`;
        return;
      }

      // Render kết quả
      matches.forEach((row, i) => {
        // Nếu bạn đã đặt STT là cột riêng, chúng ta xuất i+1
        const cells = [
          i+1,
          row['Số ĐDCN'],
          row['Mã xét tuyển'],
          row['Tên mã xét tuyển'],
          row['Họ và tên'],
          row['Ngày sinh'],
          row['Giới tính'],
          row['ĐTƯT'] || '',
          row['KVƯT'] || '',
          row['Năm TN THPT'] || '',
          row['Học lực/Kết quả học tập'] || '',
          row['Hạnh kiểm/Kết quả rèn luyện'] || '',
          row['Điểm TB Lớp 12/Điểm TB các năm học'] || '',
          row['Dân tộc'] || '',
          row['Nơi sinh'] || '',
          row['MSSV'] || '',
          row['Mã lớp'] || ''
        ];

        const tr = document.createElement('tr');
        tr.innerHTML = cells.map(c => `<td>${c}</td>`).join('');
        tbody.appendChild(tr);
      });
    },
    error: function(err) {
      console.error(err);
      const tbody = document.querySelector('#resultTable tbody');
      tbody.innerHTML = `<tr>
        <td colspan="17" style="text-align:center;color:red;">
          Lỗi khi tải dữ liệu
        </td>
      </tr>`;
    }
  });
}
