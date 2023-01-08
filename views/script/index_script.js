
function history_toggle() {
    var style = $('#history').css("display");
    if (style == "none") {
        $('#history').css("display", "block");
    } else {
        $('#history').css("display", "none");
    }
}

function lotto_extraction() {
    let lotto = [];
    let i = 0;
    let err_cnt0 = 0;
    while (i < 6) {
        let num = Math.floor(Math.random() * 44) + 1;
        let bool = true;
        for (let j in lotto) {
            if (num == lotto[j]) {
                bool = false;
            }
        }
        /* for (let k in except_num_arr) {
            if (num == except_num_arr[k]) {
                bool = false;
            }
        } */
        if (bool) {
            lotto.push(num);
            i++;
        }
        if (err_cnt0++ > 100) {
            alert("조건을 다시 설정해주시기바랍니다.");
            break;
        }
    }

    // 정렬
    lotto.sort(function (a, b) {
        return a - b;
    });

    // 출력
    let output = "";
    for (let l = 0; l < 6; l++) {
        if (lotto[l] <= 10) {
            output += "<input class='ball10 ball_big1' value='" + lotto[l] + "'disabled>";
        } else if (lotto[l] <= 20) {
            output += "<input class='ball20 ball_big1' value='" + lotto[l] + "'disabled>";
        } else if (lotto[l] <= 30) {
            output += "<input class='ball30 ball_big1' value='" + lotto[l] + "'disabled>";
        } else if (lotto[l] <= 40) {
            output += "<input class='ball40 ball_big1' value='" + lotto[l] + "'disabled>";
        } else {
            output += "<input class='ball50 ball_big1' value='" + lotto[l] + "'disabled>";
        }
    }
    
    $('#temp').html(output);
}