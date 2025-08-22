let allData = [];
let csvLoaded = false;

// Đọc file CSV khi tải trang
fetch("data.csv")
  .then(response => {
    if (!response.ok) throw new Error("Không thể tải file CSV");
    return response.text();
  })
  .then(csvText => {
    const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    allData = results.data;
    csvLoaded = true;
    console.log("CSV loaded:", allData.length, "dòng dữ liệu");
    console.log("Tên cột:", Object.keys(allData[0] || {}));
  })
  .catch(err => {
    document.getElementById("message").textContent = "Lỗi tải dữ liệu: " + err.message;
  });

function searchByDDCN() {
  const ddcn = document.getElementById("ddcnInput").value.trim();
  const messageDiv = document.getElementById("message");
  const table = document.getElementById("resultTable");

  messageDiv.textContent = "";
  table.innerHTML = "";

  if (!csvLoaded) {
    messageDiv.textContent = "Dữ liệu chưa sẵn sàng, vui lòng thử lại sau.";
    return;
  }

  if (!ddcn) {
    messageDiv.textContent = "Vui lòng nhập Số ĐDCN.";
    return;
  }

  // Lọc dữ liệu (so khớp chính xác)
  const results = allData.filter(row => (row["Số ĐDCN"] || "").trim() === ddcn);

  if (results.length === 0) {
    messageDiv.textContent = "Không tìm thấy dữ liệu cho Số ĐDCN này.";
    return;
  }

  // Tạo bảng kết quả
  const headers = Object.keys(results[0]);
  let headerRow = "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";
  let bodyRows = results.map(row => {
    return "<tr>" + headers.map(h => `<td>${row[h] || ""}</td>`).join("") + "</tr>";
}).join("");

  table.innerHTML = headerRow + bodyRows;
}

document.getElementById("searchBtn").addEventListener("click", searchByDDCN);
document.getElementById("ddcnInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchByDDCN();
  }
});

