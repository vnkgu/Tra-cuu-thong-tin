// Hàm đọc CSV và chuyển thành mảng đối tượng
async function loadCSV(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Không thể tải file CSV: ${response.statusText}`);
    }
    const text = await response.text();
    const rows = text.trim().split("\n").map(row => row.split(","));
    const headers = rows.shift();
    return rows.map(row => {
        let obj = {};
        headers.forEach((header, i) => {
            obj[header.trim()] = row[i] ? row[i].trim() : "";
        });
        return obj;
    });
}

// Hàm tìm kiếm
async function searchCCCD() {
    const input = document.getElementById("cccdInput").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<em>Đang tìm kiếm...</em>";

    if (!input) {
        resultDiv.innerHTML = "<span style='color:red'>Vui lòng nhập số CCCD</span>";
        return;
    }

    try {
        const data = await loadCSV("data.csv"); // Đọc file CSV
        const found = data.find(item => item.CCCD === input);

        if (found) {
            resultDiv.innerHTML = `
                <h3>Kết quả tìm kiếm:</h3>
                <p><strong>Họ tên:</strong> ${found["Họ tên"]}</p>
                <p><strong>Ngày sinh:</strong> ${found["Ngày sinh"]}</p>
                <p><strong>Lớp:</strong> ${found["Lớp"]}</p>
            `;
        } else {
            resultDiv.innerHTML = "<span style='color:red'>Không tìm thấy thông tin</span>";
        }
    } catch (error) {
        resultDiv.innerHTML = `<span style='color:red'>Lỗi: ${error.message}</span>`;
    }
}

// Gắn sự kiện cho nút
document.getElementById("searchBtn").addEventListener("click", searchCCCD);
