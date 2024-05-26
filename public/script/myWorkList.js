let select_page = '';

window.addEventListener('load', function() {
    let allElements = document.getElementsByTagName('*');
    Array.prototype.forEach.call(allElements, function(el) {
        let includePath = el.dataset.includePath;
        if (includePath) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
});

function init(){
    let xmlhttp = new XMLHttpRequest();
    let url = "/myWorkFolder/workList.json";
    let json_data;

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            json_data = JSON.parse(xmlhttp.responseText);
            setWorkList(json_data);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
}

init();

function setWorkList(json_data){
    let list_output = '';
    let data_length = Object.keys(json_data).length;
    for(let i = 0; i < data_length; i++){
        let work = json_data[i];
        let img_data = new Image();
        img_data.src = `/myWorkFolder/${work}/screenshot_gif.gif`;

        img_data.onload = function() {
            let calc_width = img_data.width / img_data.height * 23000;
            let temp = Math.ceil(calc_width);
            let width_result = temp / 100;
    
            list_output += `
                <div class="item list${i + 1}" value="/myWorkFolder/${work}/" style="width:${width_result}px;">
                    <span class="list_name">${work.replaceAll('_', ' ')}</span>
                    <img src="/myWorkFolder/${work}/screenshot_gif.gif" class="gif_img">
                </div>`;
            
            if (i === data_length - 1) {
                $('#workListContainer').html(list_output);
            }
        };
    }

}

$(document).on('click', '.item', function (e) {
    let temp_url = $(this).attr('value');
    let label = temp_url.substring(14, temp_url.length - 1).replaceAll('_', ' ');
    $('#confirmed_label').text(label);
    select_page = temp_url;
    $('#movePage_confirmed').css('display','block');
    $('#movePage_confirmed').css({opacity:0}).animate({opacity:1},500);
})

function movePage(url){
    let index = url + 'index.html';
    let label = url.substring(14, url.length - 1).replaceAll('_', ' ');
    let _width = '1200';
    let _height = '800';
    let _top = Math.ceil((window.screen.height - _height)/2);
    let _left = Math.ceil((window.screen.width - _width)/2);
    let option = 'width='+ _width + ',height=' + _height + ',top=' + _top + ',left=' + _left + ',resizable=yes ';
    window.open(index, label, option);
    movePage_colsed();
}

$('#cancel').on('click', () => {
    movePage_colsed();
});

function movePage_colsed(){
    $('#movePage_confirmed').css({opacity:1}).animate({opacity:0},500);
    setTimeout(() => {
        $('#movePage_confirmed').css('display','none');
    }, '500')
}

$('#confirm').on('click', () => {
    movePage(select_page);
});
