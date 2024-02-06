const reg =  /^[a-zA-Z]*$/;
var url;
var api_key = 'AppKey';
$(document).ready(function(){
    $('#content').hide();

    $('.data').keyup(function (e){
        if(e.keyCode == 13) $('.submit').click();
    })
    $('.submit').click(function(){
        $('#content').hide("fast");
        let cityname = $('.data').val().trim();
        if(cityname == ''){
            alert('입력하셔야합니다');
            return;
        }
        if(!reg.test(cityname)){
            alert('도시이름은 영어로 입력해주세요');
            return;
        }
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${api_key}`
        console.log(url);
        $.ajax({
            url: url,
            type: "GET",
            success: function(data, status){
                (status == "success") && parseJSON(data);
            },
        });
    });


});//end document ready
function parseJSON(jsonObj){
    // 현재온도
    $(".temp").text(Math.round(Number(jsonObj.main.temp)- 273.15)); //현재온도
    $(".max").text(Math.round(Number(jsonObj.main.temp_max)- 273.15)); //최고온도
    $(".min").text( Math.round(Number(jsonObj.main.temp_min)- 273.15)); //최저온도
    $(".wind").text(jsonObj.wind.speed); //바람
    $(".clouds").text(jsonObj.clouds.all); //구름
    $(".city").text(jsonObj.name); //도시이름


    // 현재온도 아이콘
    let wiconUrl = '<img id="jsonicon" src="http://openweathermap.org/img/wn/' + jsonObj.weather[0].icon + '.png" alt="' + jsonObj.weather[0].description + '">';
    $(".today-icon").html(wiconUrl);

    $('#content').fadeIn(2000);
}




setInterval(myTimer, 1000); // 1초마다 호출되게 한다.

function myTimer() {
    let today = new Date(); //데이트객체생성
    let y = today.getFullYear();
    let m = today.getMonth() + 1; //0부터 시작하므로 +1을 더해야 현재 월 이 된다.
    let d = today.getDate(); //일 값을 받아낸다.
    let day = today.getDay(); // 요일의 값을 받아낸다.
    let weekday = new Array(7); // 어레이의 각 요일을 할당하고
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    let t_time = today.toLocaleTimeString();

    $(".today-time .year").text(y);
    $(".today-time .month").text(m);
    $(".today-time .date").text(d);
    $(".day").text(weekday[today.getDay()]); //어레이의 요일의 값을 할당해 요일 출력
    $(".today-time .todayTimes").text(t_time);
}