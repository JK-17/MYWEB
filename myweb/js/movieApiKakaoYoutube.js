if (!Kakao.Auth.getAccessToken()) {
    Kakao.Auth.setAccessToken(JSON.parse(localStorage.getItem('token')));
}
var api_key = "AppKey";
var url = `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json`;
let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1;  // 월
let date = [0,today.getDate()-1].join('')// 날짜
let targetDt = [year, month, date].join('-');

$().ready(function (){
    console.log(JSON.parse(localStorage.getItem('user')));
    console.log(JSON.parse(localStorage.getItem('token')));
    $('.date').attr('value',targetDt);

    $('.research').click(function (){       //버튼 클릭 했을 때

        targetDt = $('.date').val();
        console.log(`${url}?key=${api_key}&targetDt=${targetDt.split('-').join('')}&repNationCd=${$('#type option:selected').val()}`);
        fetchData();

    });

    function fetchData(){
        $('#list').hide();
        $.ajax({
            url: `${url}?key=${api_key}&targetDt=${targetDt.split('-').join('')}&repNationCd=${$('#type option:selected').val()}`,
            type: "GET",
            success: function(data, status){
                (status == "success") && parseJSON(data);
            },
        });
    }

    function parseJSON(jsonObj){

        const table = [];
        table.push(`<table>
                <tr>
                   <td>순위</td>
                   <td>제목</td>
                   <td>상영시작일</td>
                   <td>누적관객수</td>
                   <td>카톡으로 영화정보 받기</td>
                </tr>`);
        for(e of jsonObj.boxOfficeResult.dailyBoxOfficeList){
            let rank  = e.rank;
            let moviename = e.movieNm;

            let opendate = e.openDt;
            table.push(`<tr>
                            <td>${e.rank}</td>
                            <td><a href="#main_${e.rank}">${e.movieNm}</a></td>
                            <td>${e.openDt}</td>
                            <td>${e.audiAcc}</td>
                            <td><button class="api-btn" onclick="sendToMe('${targetDt}', ${rank}, '${moviename}', '${opendate}', ${e.audiAcc})">해당 영화 정보 카톡으로 보기</button></td>
                        </tr>`);
            fetchYoutube(moviename,rank);

        }
        table.push('</table>');
        $('#list').html(table.join('\n'));
        $('#list').fadeIn(1000);
    }

    function fetchYoutube(moviname, rank){

        const keyword = moviname+'예고편';
        console.log(keyword);
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=AppKey&q=${keyword}&regionCode=KR&maxResults=4`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const obj = data.items;
                let thumbnail;
                let id;
                document.querySelector(`.main_${rank}`).innerHTML = '';
                document.querySelector(`.list_${rank}`).innerHTML = '';

                for(const i in obj) {
                    id = obj[i].id.videoId;
                    thumnail = obj[i].snippet.thumbnails.medium.url;

                    document.querySelector(`.list_${rank}`).insertAdjacentHTML('beforeend', `<div class="thumbnail" data-id="${id}"><img src="${thumnail}" /></div>`);

                    if (i == 0) {
                        document.querySelector(`.main_${rank}`).insertAdjacentHTML('beforeend', `<iframe src="//youtube.com/embed/${id}"></iframe>`);
                    }
                }
            })
            .then(function() {
                let item = document.querySelectorAll(`.list_${rank} .thumbnail`);

                item.forEach(function(e, i) {
                    e.addEventListener('click', function() {
                        id = e.getAttribute('data-id');
                        document.querySelector(`.main_${rank}`).innerHTML = `<iframe src="//youtube.com/embed/${id}"></iframe>`;
                    });
                })

            });
    }
});
function sendToMe(dateSearch,rank, movieName, openDt, audiAcc) {
    Kakao.API.request({
        url: '/v2/api/talk/memo/default/send',
        data: {
            template_object: {
                object_type: 'text',
                text:
                    `조회 한 날짜 : ${dateSearch}
날짜 기준 순위 : ${rank}
영화 이름: ${movieName}
상영 시작일: ${openDt}
누적 관객수: ${audiAcc}`,
                link: {
                    // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
                    mobile_web_url: `https://movie.daum.net`,
                    web_url: `https://movie.daum.net`,
                },
            },
        },
    })
        .then(function(res) {
            alert('success: ' + JSON.stringify(res));
        })
        .catch(function(err) {
            alert('error: ' + JSON.stringify(err));
        });
}
