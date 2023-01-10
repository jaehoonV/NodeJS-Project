
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

    $('.result').html(''); // 초기화
    
    $.ajax({
        url : "/extraction",
        type : "POST",
        dataType : "JSON",
        data : {"num1" : lotto[0], "num2" : lotto[1], "num3" : lotto[2], "num4" : lotto[3], "num5" : lotto[4], "num6" : lotto[5]}
    })
    .done(function (json){
        let json_data = JSON.parse(JSON.stringify(json));
        for(let i = 0; i < json_data.length; i++){
            let output = '<div><span>' + json_data[i].ROUND + '회차 </span>'
                + include_check(lotto,json_data[i].NUM1)
                + include_check(lotto,json_data[i].NUM2)
                + include_check(lotto,json_data[i].NUM3)
                + include_check(lotto,json_data[i].NUM4)
                + include_check(lotto,json_data[i].NUM5)
                + include_check(lotto,json_data[i].NUM6)
                +'</div>';
            $('.result').append(output);
        }
    })
    .fail(function (xhr, status, errorThrown){
        alert("Ajax failed")
    })
}

function include_check(lotto, num){
    if(lotto.includes(num)){
        if (num <= 10) {
            return "<input class='ball10 ball' value='" + num + "'disabled>";
        } else if (num <= 20) {
            return "<input class='ball20 ball' value='" + num + "'disabled>";
        } else if (num <= 30) {
            return "<input class='ball30 ball' value='" + num + "'disabled>";
        } else if (num <= 40) {
            return "<input class='ball40 ball' value='" + num + "'disabled>";
        } else {
            return "<input class='ball50 ball' value='" + num + "'disabled>";
        }
        
    }

    return "<input class='ball10 ball not_include_ball' value='" + num + "'disabled>";
}