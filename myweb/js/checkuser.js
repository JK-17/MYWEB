
var user = null;
// 사용자 정보가 있으면 로그아웃 버튼을 없으면 로그인 페이지로 이동
$(document).ready(function(){
    if(Kakao.Auth.getAccessToken()){

        $('.login').css('display', 'none');

        $('.map').click(function(){
            location.href = './map.html';
        });
        $('.weather').click(function(){
            location.href = './weather.html';
        });
        $('.movie').click(function(){
            location.href = './movie.html';
        });
        $('.moveTomainPage').click(function(){
            location.href = './index.html';
        });
    }else{
        $('.logout').css('display', 'none');
        $('a').click(function (){
            alert('로그인 후에 이용해 주시기 바랍니다.');
        });
        $('.moveTomainPage').click(function(){
            location.href = './index.html';
        });
    }
});