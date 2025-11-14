$(function () {
    // Khai báo các object
    var container = $('#container');
    var bird = $('#bird');
    var pole = $('.pole');
    var pole_1 = $('#pole_1');
    var pole_2 = $('#pole_2');
    var score = $('#score');
    var level_span = $('#level'); // span hiển thị Level

    // Chuyển các thông tin của object sang dạng số INT
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var pole_initial_position = parseInt(pole.css('right'));
    var pole_initial_height = parseInt(pole.css('height'));
    var bird_left = parseInt(bird.css('left'));
    var bird_height = parseInt(bird.height());
    var speed = 10; // Tốc độ di chuyển ống nước

    // Một số trạng thái trong game
    var go_up = false;   // id interval của việc bay lên
    var score_updated = false;
    var game_over = false;

    // Quản lý Level & interval vòng lặp
    var level = 1;
    var interval = 40;    // Level 1: 40ms
    var the_game;             // id của setInterval
    var high_score_span = $('#high_score');

    // Lấy best score từ localStorage (nếu có)
    var high_score = localStorage.getItem('flappy_highscore') || 0;
    high_score = parseInt(high_score);
    high_score_span.text('Best: ' + high_score);

    // Hiển thị Level ban đầu
    level_span.text('Level ' + level);


    function check_level_and_win(current_score) {
        // 50 điểm thì thắng
        if (current_score >= 50) {
            win_the_game();
            return;
        }

        var new_level = level;
        var new_interval = interval;

        // Quy tắc Level
        if (current_score >= 40) {
            new_level = 4;
            new_interval = 20;
        } else if (current_score >= 20) {
            new_level = 3;
            new_interval = 25;
        } else if (current_score >= 5) {
            new_level = 2;
            new_interval = 30;
        } else {
            new_level = 1;
            new_interval = 40;
        }

        // Nếu level thay đổi thì cập nhật & restart interval
        if (new_level !== level) {
            level = new_level;
            interval = new_interval;
            level_span.text('Level ' + level);
            restart_game_interval();
        }
    }

    function restart_game_interval() {
        clearInterval(the_game);
        the_game = setInterval(game_loop, interval);
    }


    function game_loop() {
        if (collision(bird, pole_1) || // Nếu chú chim va chạm với ống trên
            collision(bird, pole_2) || // Hoặc chú chim va chạm với ông dưới
            parseInt(bird.css('top')) <= 0 || // Hoặc chú chim chạm khung game trên
            parseInt(bird.css('top')) > container_height - bird_height // Hoặc chú chim chạm khung game dưới
        ) {
            stop_the_game(); // Chạy hàm thua game
        } else {
            // Lấy vị trị hiện tại của ống nước
            var pole_current_position = parseInt(pole.css('right'));

            // Cập nhật điểm khi chú chim vượt qua 1 cặp ống
            if (pole_current_position > container_width - bird_left) {
                if (score_updated === false) {
                    var current_score = parseInt(score.text()) + 1;
                    score.text(current_score); // Cộng 1 điểm
                    score_updated = true;
                    if (current_score > high_score) {
                        high_score = current_score;
                        localStorage.setItem('flappy_highscore', high_score);
                        high_score_span.text('Best: ' + high_score);
                    }
                    // Kiểm tra Level + thắng
                    check_level_and_win(current_score);
                }
            }

            // Kiểm tra các ống đã đi ra khỏi khung game 
            if (pole_current_position > container_width) {
                var new_height = parseInt(Math.random() * 100);
                // Tạo chiều cao các ống nước ngẫu nhiên
                pole_1.css('height', pole_initial_height + new_height);
                pole_2.css('height', pole_initial_height - new_height);
                score_updated = false;
                pole_current_position = pole_initial_position; // Gán vị trị hiện tại = vị trí ban đầu của ống nước
            }

            // Di chuyển ống nước
            pole.css('right', pole_current_position + speed);

            // Nếu không điều khiển chú chim bay lên
            if (go_up === false) {
                go_down(); // Hàm di chuyển chú chim rơi xuống
            }
        }
    }

    // Hàm bắt đầu game
    function playGame() {
        if (game_over) return;
        the_game = setInterval(game_loop, interval);
    }



    // Nhấn ArrowDown -> chim bay lên
    $(document).keydown(function (e) {
        if (e.key === "ArrowDown" && go_up === false && !game_over) {
            e.preventDefault();
            go_up = setInterval(up, 40); // Realtime hành động bay lên cho chú chim
        }
    });

    // Thả ArrowDown -> dừng bay lên
    $(document).keyup(function (e) {
        if (e.key === "ArrowDown") {
            clearInterval(go_up); // Xoá realtime hành động bay lên cho chú chim
            go_up = false;
        }
    });

    // Khi nhấn vào Chơi game
    $('#play_btn').click(function () {
        playGame(); // Chạy hàm bắt đầu chơi game
        $(this).hide(); // Ẩn nút chơi game
    });

    // Hàm di chuyển chú chim rơi xuống
    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10);
        bird.css('transform', 'rotate(50deg)'); // Nghiêng object chú chim 50 độ
    }

    // Hàm di chuyển chú chim bay lên
    function up() {
        bird.css('top', parseInt(bird.css('top')) - 20);
        bird.css('transform', 'rotate(-10deg)'); // Nghiêng object chú chim -10 độ
    }

    // Hàm thua game
    function stop_the_game() {
        clearInterval(the_game);   // đúng: xóa interval đang chạy
        clearInterval(go_up);
        go_up = false;
        game_over = true;
        $('#restart_btn').slideDown(); // Hiện nút chơi lại
    }

    // Hàm thắng game (>= 50 điểm)
    function win_the_game() {
        clearInterval(the_game);
        clearInterval(go_up);
        go_up = false;
        game_over = true;
        alert("Chúc mừng bạn đã chiến thắng với " + score.text() + " điểm!");
        $('#restart_btn').slideDown();
    }

    // Khi click vào nút Chơi lại
    $('#restart_btn').click(function () {
        location.reload(); // Tải lại trang
    });

    // Hàm va chạm giữa 2 object
    function collision($div1, $div2) {
        // Khai báo các thông số của 2 object
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;

        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        // Nếu không va chạm
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        }
        // Ngược lại có va chạm
        else {
            return true;
        }
    }
});