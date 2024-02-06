let reg_for_sub = [/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/, /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/];
var api_key = 'AppKey';
var url = 'https://apis.data.go.kr/B551011/KorService1';
var fetchUrl;
let currentIndex;
$(document).ready(function(){

    $("form[name*='frm']").hide();
    $("#btn").hide();

    $(".radiobtn input[type=radio]").click(function(){
        $("form[name*='frm']").hide();
        $('#btn').show();
        currentIndex = $('.radiobtn input[type=radio]').index(this);
        $("form[name*='frm']").eq($('.radiobtn input[type=radio]').index(this)).show();
    });

    $("#btn").click(function(){

        switch (currentIndex) {
            case 0:
                if ($("input[name='keyword']").val().trim() == '') {
                    alert('키워드는 필수입니다');
                    return;
                }

                if (!reg_for_sub[0].test($("input[name='keyword']").val().trim())) {
                    alert('한국말로 입력하세요');
                    return;
                } else {
                    fetchUrl = `${url}${$('.radiobtn input[type=radio]:checked').val()}?MobileOS=ETC&MobileApp=MobileApp&_type=json&keyword=${encodeURI($("input[name='keyword']").val())}&serviceKey=${api_key}`;
                    console.log(fetchUrl);
                    $.ajax({
                        url: fetchUrl,
                        type: "GET",
                        success: function(data, status){
                            (status == "success") && parseJSON(data);
                        },
                    });
                }
                break;
            case 1:
                if (!reg_for_sub[1].test($("input[name='dateFest']").val())) {
                    alert('입력하신 날짜 형식이 아닙니다');
                    return;
                } else {
                    fetchUrl = `${url}${$('.radiobtn input[type=radio]:checked').val()}?MobileOS=ETC&MobileApp=MobileApp&_type=json&eventStartDate=${$("input[name='dateFest']").val().split('-').join('')}&serviceKey=${api_key}`;
                    console.log(fetchUrl);
                    $.ajax({
                        url: fetchUrl,
                        type: "GET",
                        success: function(data, status){
                            (status == "success") && parseJSON(data);
                        },
                    });
                }
                break;
            case 2:
                fetchUrl = `${url}${$('.radiobtn input[type=radio]:checked').val()}?MobileOS=ETC&MobileApp=MobileApp&_type=json&serviceKey=${api_key}`;
                console.log(fetchUrl);
                $.ajax({
                    url: fetchUrl,
                    type: "GET",
                    success: function(data, status){
                        (status == "success") && parseJSON(data);
                    },
                });
                break;
        }

    }); //버튼 클릭 종료

    function parseJSON(jsonObj){
        const table = [];
        table.push('<div id = "datasfromitem">');
        for(e of jsonObj.response.body.items.item){
            table.push(`<div class="contentsfromitem">
                           <div>제목: ${e.title}</div>
                           <div>주소: ${e.addr1}</div>
                           <div>전화번호: ${e.tel == '' ? 'NOINFO' : e.tel}</div>
                           <a href="https://www.google.com/search?q=${e.title}" target="_blank">구글로 검색하기</a>
                           <img src = "${e.firstimage}" alt="NO IMG">
                          </div>`);
        }
        table.push('</div>');
        $('#result').html(table.join('\n'));
    }



}); //doc ready





