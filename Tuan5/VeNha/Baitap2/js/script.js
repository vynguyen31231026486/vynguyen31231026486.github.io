const container = document.getElementById("container");
const bird = document.getElementById("bird");
const pole_1 = document.getElementById("pole_1");
const pole_2 = document.getElementById("pole_2");
const score_span = document.getElementById("score");
const play_btn = document.getElementById("play_btn");
const restart_btn = document.getElementById("restart_btn");

let game_interval;
let gravity_interval;

let speed = 2;
let gravity = 2;
let isPlaying = false;
let score = 0;

// -------------------------
// BẮT ĐẦU GAME
// -------------------------
play_btn.onclick = function () {
    play_btn.style.display = "none";
    startGame();
};

// -------------------------
function startGame() {
    isPlaying = true;
    score = 0;
    score_span.innerHTML = score;

    // Reset vị trí ống
    pole_1.style.right = "-64px";
    pole_2.style.right = "-64px";

    // Làm chim rơi
    gravity_interval = setInterval(() => {
        let bird_top = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
        bird.style.top = bird_top + gravity + "px";
    }, 30);

    // Cho ống chạy
    game_interval = setInterval(gameLoop, 20);
}

// -------------------------
// GAME LOOP
// -------------------------
function gameLoop() {
    let pole_right = parseInt(window.getComputedStyle(pole_1).getPropertyValue("right"));

    // Move pipes
    pole_1.style.right = pole_right + speed + "px";
    pole_2.style.right = pole_right + speed + "px";

    // Nếu ống đi hết → reset
    if (pole_right > 400) {
        changePipeHeight();
        pole_1.style.right = "-64px";
        pole_2.style.right = "-64px";

        score++;
        score_span.innerHTML = score;
    }

    checkCollision();
}

// -------------------------
// RANDOM ỐNG
// -------------------------
function changePipeHeight() {
    let gap = 130;
    let topHeight = Math.floor(Math.random() * 200) + 50;
    let bottomHeight = 480 - topHeight - gap;

    pole_1.style.height = topHeight + "px";
    pole_2.style.height = bottomHeight + "px";
}

// -------------------------
// BAY LÊN KHI CLICK
// -------------------------
document.addEventListener("keydown", jump);
document.addEventListener("click", jump);

function jump() {
    if (!isPlaying) return;
    let bird_top = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    bird.style.top = bird_top - 50 + "px";
}

// -------------------------
// VA CHẠM
// -------------------------
function checkCollision() {
    let bird_rect = bird.getBoundingClientRect();
    let top_pipe = pole_1.getBoundingClientRect();
    let bottom_pipe = pole_2.getBoundingClientRect();
    let container_rect = container.getBoundingClientRect();

    if (
        bird_rect.top <= container_rect.top ||
        bird_rect.bottom >= container_rect.bottom ||
        isCollision(bird_rect, top_pipe) ||
        isCollision(bird_rect, bottom_pipe)
    ) {
        gameOver();
    }
}

function isCollision(a, b) {
    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );
}

// -------------------------
// GAME OVER
// -------------------------
function gameOver() {
    isPlaying = false;
    clearInterval(game_interval);
    clearInterval(gravity_interval);

    restart_btn.style.display = "block";
}

restart_btn.onclick = function () {
    restart_btn.style.display = "none";
    startGame();
};
