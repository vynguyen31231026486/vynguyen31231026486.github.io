let wrongCount = 0;  // số lần bấm KHÔNG
let isSwapped  = false; // trạng thái đổi nút

function render() {
  document.body.innerHTML = `
    <div class="card">
      <div class="title">BẠN CÓ THÍCH MÌNH KHÔNG? 💖</div>
      <div class="subtitle">Trả lời thật lòng nha 💌</div>
      <div class="buttons">
        ${!isSwapped
          ? `<button id="yesBtn"><span class="icon">💘</span>CÓ</button>
             <span class="divider">|</span>
             <button id="noBtn"><span class="icon">😉</span>KHÔNG</button>`
          : `<button id="noBtn"><span class="icon">😉</span>KHÔNG</button>
             <span class="divider">|</span>
             <button id="yesBtn"><span class="icon">💘</span>CÓ</button>`
        }
      </div>
    </div>
  `;

  const yesBtn = document.getElementById("yesBtn");
  const noBtn  = document.getElementById("noBtn");

  yesBtn.addEventListener("click", onYesClick);
  noBtn .addEventListener("click", onNoClick);
}

function onNoClick() {
  wrongCount++;
  if (wrongCount < 3) {
    alert("Có thể bạn nên chọn lại 😏");
  } else {
    alert("Thôi được rồi, mình đổi vị trí nút cho bạn chọn lại nha 😎");
    isSwapped = !isSwapped;
    wrongCount = 0;
    render();
  }
}

function onYesClick() {
  alert("Xin lỗi, bạn không phải là đối tượng của mình 😅");
}

// khởi tạo giao diện khi tải trang
render();
