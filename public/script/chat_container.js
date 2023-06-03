let chat_list;

function init(){
    let user = 'aa';
    let master_seq = 1;

    $.ajax({
        url : "/chat_container/",
        type : "POST",
        dataType : "JSON",
        data : {"user" : user,
                "master_seq" : master_seq}
    })
    .done(function (json){
        let json_data = JSON.parse(JSON.stringify(json));
        chat_list = json_data.results_1;
        console.log(chat_list);
        create_chat_container();
    })
    .fail(function (xhr, status, errorThrown){
        alert("Ajax failed")
    })
}

init();

function create_chat_container(){
    let chat_result = "";

    for(let chat of chat_list){
        let reg_day = chat.reg_day;
        let reg_time = chat.reg_time;
        if(chat.mine_div == 'mine'){
            chat_result += "<div class='my_chat_box'>"; 
            if(chat.unread_num != 0){
                chat_result += "<em class='em_yellow'>" + chat.unread_num +"</em>";
            }
            chat_result += "<em>" + reg_time +"</em>";
            chat_result += "<span>"+ chat.contents + "</span>"
        }else{
            chat_result += "<div class='chat_box'><span>" + chat.contents + "</span>"
            if(chat.unread_num != 0){
                chat_result += "<em class='em_yellow'>" + chat.unread_num +"</em>";
            }
            chat_result += "<em>" + reg_time +"</em>";
        }
        chat_result += "</div>";
    }

    $('#chat_container').html(chat_result);
}