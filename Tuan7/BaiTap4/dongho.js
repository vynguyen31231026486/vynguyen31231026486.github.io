// Khai báo biến giờ, phút, giây và timeout
var h = 0, m = 0, s = 0;
var timeout = null;

// Hàm bắt đầu đếm ngược
function startCountdown() {
    // Lấy giá trị nhập vào, mặc định 0 nếu rỗng
    h = parseInt(document.getElementById("h_val").value) || 0;
    m = parseInt(document.getElementById("m_val").value) || 0;
    s = parseInt(document.getElementById("s_val").value) || 0;

    // Nếu đồng hồ đang chạy, dừng trước khi bắt đầu lại
    if(timeout) clearTimeout(timeout);

    // Hàm đếm ngược
    function countdown() {
        // Hiển thị ra màn hình, thêm số 0 nếu < 10
        document.getElementById("h").textContent = h < 10 ? "0" + h : h;
        document.getElementById("m").textContent = m < 10 ? "0" + m : m;
        document.getElementById("s").textContent = s < 10 ? "0" + s : s;

        // Giảm giây
        s--;

        // Nếu giây < 0, giảm phút
        if (s < 0) {
            s = 59;
            m--;
        }

        // Nếu phút < 0, giảm giờ
        if (m < 0) {
            m = 59;
            h--;
        }

        // Nếu giờ < 0, dừng đồng hồ
        if (h < 0) {
            clearTimeout(timeout);
            alert("Hết giờ!");
            return;
        }

        // Gọi lại sau 1 giây
        timeout = setTimeout(countdown, 1000);
    }

    countdown(); // Bắt đầu đếm
}

// Hàm dừng đồng hồ
function stopCountdown() {
    if(timeout) clearTimeout(timeout);
}

// Gắn sự kiện cho nút Start và Stop
document.getElementById("startBtn").addEventListener("click", startCountdown);
document.getElementById("stopBtn").addEventListener("click", stopCountdown);
