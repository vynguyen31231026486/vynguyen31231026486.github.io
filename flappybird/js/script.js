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

    // --- Hàm kiểm tra Level & thắng ---
    function check_level_and_win(current_score) {
        if (current_score >= 50) {
            win_the_game();
            return;
        }

        var new_level = level;
        var new_interval = interval;

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

    // --- Vòng lặp chính ---
    function game_loop() {
        if (collision(bird, pole_1) || collision(bird, pole_2) ||
            parseInt(bird.css('top')) <= 0 ||
            parseInt(bird.css('top')) > container_height - bird_height
        ) {
            stop_the_game();
        } else {
            var pole_current_position = parseInt(pole.css('right'));

            if (pole_current_position > container_width - bird_left) {
                if (!score_updated) {
                    var current_score = parseInt(score.text()) + 1;
                    score.text(current_score);
                    score_updated = true;
                    if (current_score > high_score) {
                        high_score = current_score;
                        localStorage.setItem('flappy_highscore', high_score);
                        high_score_span.text('Best: ' + high_score);
                    }
                    check_level_and_win(current_score);
                }
            }

            if (pole_current_position > container_width) {
                var new_height = parseInt(Math.random() * 100);
                pole_1.css('height', pole_initial_height + new_height);
                pole_2.css('height', pole_initial_height - new_height);
                score_updated = false;
                pole_current_position = pole_initial_position;
            }

            pole.css('right', pole_current_position + speed);

            if (!go_up) {
                go_down();
            }
        }
    }

    // --- Bắt đầu game ---
    function playGame() {
        if (game_over) return;
        the_game = setInterval(game_loop, interval);
    }

    $('#play_btn').click(function () {
        playGame();
        $(this).hide();
    });

    // --- Chim bay lên khi nhấn ArrowDown ---
    $(document).keydown(function (e) {
        if (e.key === "ArrowDown" && !go_up && !game_over) {
            e.preventDefault();
            go_up = setInterval(up, 40);
        }
        // --- Bổ sung: chim bay khi nhấn Space ---
        if (e.key === " " && !game_over) {
            e.preventDefault();
            up(); // bay lên 1 nhịp
        }
    });

    $(document).keyup(function (e) {
        if (e.key === "ArrowDown") {
            clearInterval(go_up);
            go_up = false;
        }
    });

    // --- Bổ sung: chim bay khi click màn hình ---
    $('#container').click(function () {
        if (!game_over) {
            up(); // chim bay lên 1 nhịp
        }
    });

    // --- Hàm chim rơi ---
    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10);
        bird.css('transform', 'rotate(50deg)');
    }

    // --- Hàm chim bay lên ---
    function up() {
        bird.css('top', parseInt(bird.css('top')) - 20);
        bird.css('transform', 'rotate(-10deg)');
    }

    // --- Hàm thua game ---
    function stop_the_game() {
        clearInterval(the_game);
        clearInterval(go_up);
        go_up = false;
        game_over = true;
        $('#restart_btn').slideDown();
    }

    // --- Hàm thắng game ---
    function win_the_game() {
        clearInterval(the_game);
        clearInterval(go_up);
        go_up = false;
        game_over = true;
        alert("Chúc mừng bạn đã chiến thắng với " + score.text() + " điểm!");
        $('#restart_btn').slideDown();
    }

    $('#restart_btn').click(function () {
        location.reload();
    });

    // --- Hàm va chạm ---
    function collision($div1, $div2) {
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

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        } else {
            return true;
        }
    }
});
