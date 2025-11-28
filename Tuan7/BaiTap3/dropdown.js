// Lấy tất cả các thẻ <a> trực tiếp nằm trong các <li> của menu chính
// Đây là các link của menu cha, ví dụ: "Sản phẩm", "Tin tức", "Dịch vụ"
const menus = document.querySelectorAll("#dropdown > li > a");

// Duyệt qua từng link của menu cha
menus.forEach(menu => {
  // Gắn sự kiện click cho từng link
  menu.addEventListener("click", function (e) {
    e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a> (tránh nhảy trang khi href="#")

    // Lấy thẻ <ul> con ngay sau <a>, chính là submenu của menu hiện tại
    const submenu = this.nextElementSibling;

    if (submenu) {
      // Đóng tất cả các submenu khác, chỉ giữ menu hiện tại có thể mở
      document.querySelectorAll("#dropdown ul").forEach(ul => {
        if (ul !== submenu) { // Nếu không phải submenu hiện tại
          ul.style.display = "none"; // Ẩn submenu đó
        }
      });

      // Toggle (mở/đóng) submenu hiện tại
      // Nếu đang hiển thị, ẩn đi; nếu đang ẩn, hiện ra
      submenu.style.display = submenu.style.display === "block" ? "none" : "block";
    }
  });
});
