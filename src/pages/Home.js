import React, { useState, useEffect } from "react"
import styled from "styled-components"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { updateWeatherInfo, updatePostId } from "../actions/index"
import TopButton from "../components/TopButton";
import { useHistory } from "react-router-dom"
import { nanoid } from 'nanoid';
// import Loading from "./Loading";

const HomeContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    padding-right: 5vh;
    background-color: var(--page-bg-color);
    ul {
      list-style: none;
    }

    @media screen and (min-width: 3000px){
      width: 80%;
    }

    @media screen and (min-width: 1500px) {
        margin: 0 auto;
        width: 90%;
        border: 1px solid #aaa;
    }
    @media screen and (max-width: 1081px) {
        flex-direction: column;
        margin: 0 auto;
        padding: 0 2vw;
        border: 1px solid #aaa;
        width: 85%;
        height: 100%;
    }
    @media screen and (max-width: 900px) {
        width: 100%;
    }
`

// 날짜
const TodaysDate = styled.div`
  background-color: var(--page-bg-color);
  margin: 0 auto;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  #curDate{
    padding-left: 2vw;
  }
  #curLocation{
    padding-right: 2vw;
  }

  @media screen and (min-width: 1500px) {
    width: 90%;
    #curDate{
      padding-left: 0;
    }
    #curLocation{
      padding-right: 0;
    }
  }
  @media screen and (max-width: 1081px) {
    width: 85%;
  }
  @media screen and (max-width: 900px) {
    width: 100%;
  }
  @media screen and (max-width: 500px) {
    font-size: 15px;
  }
  @media screen and (max-width: 375px) {
    font-size: 12px;
  }
`

// 왼쪽 container
const LeftContainer1 = styled.div`
display: flex;
gap: 0.1rem;
flex-direction: row;
width: 40vw;
flex-wrap: wrap;
.weatherInfo {
  text-align: center;
  line-height: 3rem;
  li{
    align-items: center;
  }
  img{
    width: 2rem;
    height: 2rem;
    vertical-align: middle;
  }
}
.codiInfo {
  text-align: center;
}
@media screen and (max-width: 1081px) {
  margin: 0 auto;
  width: 100%;
}
@media screen and (max-width: 300px) {
  img{
    width: 3rem;
    height: 3rem;
  }
}
`;

// 00구 주민예보
const LeftNav1 = styled.nav`
  text-align: center;
  flex-basis: 310px;
  flex-grow: 1;
  margin: 30px 5px 5px 5px;
  padding: 10px;
  line-height: 3vh;
  height: 25%;
  background-color: var(--page-bg-color);
  p {
    font-size: 1.2rem;
    margin-bottom: 1vh;
  }
  @media screen and (max-width: 1081px) {
    margin-top: 5px;
  }

  @media screen and (max-width: 375px) {
    margin-top: 10px;
    line-height: 4vh;
    border-bottom: 1px solid #8e8e8e ;
  }
`
// 기상청 일기예보
const LeftNav2 = styled.div`
  text-align: center;
  flex-basis: 310px;
  flex-grow: 1;
  margin: 5px;
  padding: 10px;
  line-height: 3vh;
  height: 35%;
  background-color: var(--page-bg-color);
  p {
    font-size: 1.2rem;
    margin-bottom: 1vh;
  }
  @media screen and (max-width: 375px) {
    line-height: 4vh;
    border-bottom: 1px solid #8e8e8e ;
  }
`
// 00구 날씨 기반 추천 코디
const LeftNav3 = styled.div`
  text-align: center;
  flex-basis: 310px;
  flex-grow: 1;
  margin: 3px;
  padding: 10px;
  background-color: var(--page-bg-color);
  height: 35%;
  p {
    font-size: 1.2rem;
    margin: 2vh 0;
  }
  .codiInfo{
    height: 80%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  @media screen and (max-width: 1081px) {
    height: 30vh;
    flex-basis: 100vh;
    flex-grow: 2;
  }
  @media screen and (max-width: 375px) {
    p {
      font-size: 1.2rem;
      margin: 2vh 0;
    }
    .codiInfo {
      /* border: 1px solid hotpink; */
      height: 80%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    @media screen and (max-width: 1081px) {
      height: 30vh;
      flex-basis: 100vh;
      flex-grow: 2;
    }
    @media screen and (max-width: 375px) {
      border-bottom: 1px solid #8e8e8e ;
      p {
        font-size: 1rem;
        margin: 1vh 0;
      }
    }
  }
`
// 코디 이미지
const Codi = styled.img`
  width: 7rem;
  height: 7rem;
  border: purple;
  @media screen and (max-width: 400px) {
    width: 5rem;
    height: 5rem;
  }
`

// 오른쪽 container
const RightContainer = styled.div`
  display: grid;
  /* height:100vh; */
  width: 80vw;
  grid-template-rows: 0.5fr 2.3fr 2.3fr 2.3fr;
  grid-template-columns: 1fr 1fr 1fr;
  grid-area: 
  "nav nav"
  "main main"
  "main main"
  ;
  grid-gap:0.1rem;
  transition: all 0.01s ease-in-out;
  .userPost{
    &:hover{
      border-bottom: 1px solid #FAFAFA;
    }
  }
  
  @media (max-width: 600px) {
    .userPost:nth-last-child(1){
      display: none;
    }
    grid-template-rows: 0.5fr 1.5fr 1.5fr 1.5fr 1.5fr;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "nav"
      "main";
  }
  .userPost {
    text-align: center;
  }
  img{
    width: 100%;
    height: 100%;
  }
  @media screen and (max-width: 1081px) {
    margin: 0 auto;
    width: 100%;
  }
`;


// '00구 주민예보글'
const RightNav1 = styled.nav`
    margin-top: 0.8rem;
    text-align: center;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "nav nav";
    grid-column: 1 / 4;
    grid-row: 1 / 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1vh 1vh;
    #location {
        font-size: 1.5rem;
        color: #8e8e8e;
    }
    #moreView {
        color: #336fc9;
    }
    @media screen and (max-width: 600px) {
        grid-column: 1 / 3;
        #location {
            font-size: 1rem;
        }
    }
`

let url = process.env.REACT_APP_LOCAL_URL
if (!url) url = "https://thereweather.space"

export default function Home() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { item, curLocation } = useSelector((state) => state.itemReducer)
  console.log(item)
  console.log('카카오 위도 : ', curLocation.lat); // map 페이지 거쳐야함
  console.log('카카오 경도 : ', curLocation.lon);

  // const { userInfo } = useSelector((state) => state.itemReducer)
  // dispatch(changeUser(axiosData))

  const [weatherData, setWeatherData] = useState()

  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
          let lat = position.coords.latitude, // 위도
              lon = position.coords.longitude // 경도
          console.log(lat, lon) //브라우저에 찍힘        
          axios({
              url: url + "/map",
              method: "post",   
              data: { lat: lat, lon: lon },
              withCredentials: true
          })
          .then((res) => {
            //console.log(res.data)
            //console.log(res.data.item)
            setWeatherData(res.data)
            dispatch(updateWeatherInfo(res.data))    
          })
      })
    };
  }, [])

  // 현재 위치 주소
  const [curAddress, setcurAddress] = useState('');
  // 최근 게시물(위도, 경도, 지역범위 확인)
  const [currentPosts, setcurrentPosts] = useState([])
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = curLocation.lat, // 위도
            lon = curLocation.lon // 경도
        // 37.5525698 127.0783197
        /*
          소수 7째자리까지 : Math.floor(a * 10000000) /10000000

          남서쪽 위도, 경도는  (37.5262196, 127.0449971)이고
          북동쪽 위도, 경도는  (37.5684781, 127.1200016)입니다 
        */

        // left(37.5262196) , right(37.5684781) : 0.0422585(0.04225850000000264), 각 0.02112925
        // bottom(127.0449971) , top(127.1200016) : 0.0750045(0.07500449999999148), 각 0.03750225
        // 현재 위도, 경도의 동,서,남,북 범위 설정 (소수 7째자리까지)
        let right = lat + 0.02112925
        let left = lat - 0.02112925
        let top = lon + 0.03750225
        let bottom = lon - 0.03750225

        console.log(right, left, top, bottom);

        axios({
          url: url + "/home",
          method: "post",
          data: {
            lat: lat,
            lon: lon,
            right: right,
            left: left,
            top: top,
            bottom: bottom,
          },
          withCredentials: true
        })
        .then((res) => {
          // console.log('res : ', res.data.address);
          console.log('address : ', res.data.address)
          console.log('게시글 데이터 : ', res.data.curtPost);
          setcurrentPosts(res.data.curtPost)  // 주민예보글 렌더링 부분
          setcurAddress(res.data.address)

          // dispatch(homePost(res.data))
        })
      })
    };
  }, [])

    // 날짜
    const [todaysDate, settodaysDate] = useState("")
    useEffect(() => {
        let date = new Date()
        const formatDate = (currentDate) => {
            let formatted = `${currentDate.getFullYear()}년 ${
                currentDate.getMonth() + 1
            }월 ${currentDate.getDate()}일`
            return formatted
        }
        settodaysDate(formatDate(date))
    })

  // 날씨, 코디 가져오기, 추후 수정
  let [currentTemp, setcurrentTemp] = useState('')
  let [currentWind, setcurrentWind] = useState('')
  let [currentWeather, setcurrentWeather] = useState('')
  let [currentOuter, setcurrentOuter] = useState('')
  let [currentTop, setcurrentTop] = useState('')
  let [currentBottom, setcurrentBottom] = useState('')
  
  useEffect(() => {
    let tempArr = []  // 체감온도
    let windArr = []  // 바람세기
    let weatherArr = [] // 날씨상태
    let outerArr = []  // 겉옷
    let topArr = []  // 상의
    let bottomArr = [] // 하의

    // 해당 key만 가져오기
    for(let i = 0; i < currentPosts.length; i++){
      tempArr.push(currentPosts[i].temp)  // temp키만 가져옴
      windArr.push(currentPosts[i].wind)
      weatherArr.push(currentPosts[i].weather)

      outerArr.push(currentPosts[i].outer_id)
      topArr.push(currentPosts[i].top_id)
      bottomArr.push(currentPosts[i].bottom_id)
    }

    // 해당 키의 중복개수세는 함수
    function getCount(arr){
      return arr.reduce((pv, cv) => {
        pv[cv] = (pv[cv] || 0) + 1;
        return pv;
      }, {})
    }

    let tempObj = getCount(tempArr) // {hot: 6, cold: 3}
    let windObj = getCount(windArr)
    let weatherObj = getCount(weatherArr)
    let outerObj = getCount(outerArr)
    let topObj = getCount(topArr)
    let bottomObj = getCount(bottomArr)

    // 최대값구하기 : 객체 -> 배열
    let newTempArr = Object.values(tempObj) // [6, 3]
    let newWindArr = Object.values(windObj)
    let newWeatherArr = Object.values(weatherObj)
    let newOuterArr = Object.values(outerObj)
    let newTopArr = Object.values(topObj)
    let newBottomArr = Object.values(bottomObj)
    // 최대값
    let tempMaxNum = Math.max(...newTempArr) // 6
    let windMaxNum = Math.max(...newWindArr)
    let weatherMaxNum = Math.max(...newWeatherArr)
    let outerMaxNum = Math.max(...newOuterArr)
    let topMaxNum = Math.max(...newTopArr)
    let bottomMaxNum = Math.max(...newBottomArr)

    // 최대값과 일치하는 key 추출
    function matchKey(obj, maxNum){ // 객체, 최대값
      for(let key in obj){
        if(obj[key] === maxNum){
          return key
        }
      }
    }
    
    // 화면에 나타날 key
    let maxTemp = matchKey(tempObj, tempMaxNum)
    let maxWind = matchKey(windObj, windMaxNum)
    let maxWeather = matchKey(weatherObj, weatherMaxNum)
    let maxOuter = matchKey(outerObj, outerMaxNum)
    let maxTop = matchKey(topObj, topMaxNum)
    let maxBottom = matchKey(bottomObj, bottomMaxNum)

    setcurrentTemp(maxTemp)
    setcurrentWind(maxWind)
    setcurrentWeather(maxWeather)
    setcurrentOuter(maxOuter)
    setcurrentTop(maxTop)
    setcurrentBottom(maxBottom)

    console.log('currentTemp : ', currentTemp);
    console.log('currentWind : ', currentWind);
    console.log('currentWeather : ', currentWeather);
    console.log('outer : ', currentOuter);  // 안나옴
  })

  // 게시물 사진 클릭
  const photoClickHandler = (e) => {
    // console.log(e.target.id); // 게시물id 전달
    let elem = e.target;

    dispatch(updatePostId(elem.id));
    history.push({
      pathname: '/postread',
      state: {postId: elem.id}
    })
  }


    return (
        <div className="homecontainer">
            {/* <Loading /> */}
            <TopButton/>
            <TodaysDate>
              <p id="curDate">날짜 : {todaysDate}</p>
              <p id="curLocation">위치 : {curAddress}</p>
            </TodaysDate>
            <HomeContainer>
                <LeftContainer1>
                    <LeftNav1>
                        <p>주민예보</p>
                        <div className="weatherInfo">
                          {
                            currentTemp === undefined && currentWind === undefined && currentWeather === undefined ?
                            <p>현재 날씨 데이터가 없습니다 :(</p>
                            :
                            <ul>
                              <li>
                                <span>현재위치 체감온도 </span>
                                <img src={`${process.env.PUBLIC_URL}img/icons-write/${currentTemp}.png`} alt="온도"/>
                              </li>
                              <li>
                                <span>현재위치 바람세기 </span>
                                <img src={`${process.env.PUBLIC_URL}img/icons-write/${currentWind}.png`} alt="바람"/>
                              </li>
                              <li>
                                <span>현재위치 날씨상태 </span>
                                <img src={`${process.env.PUBLIC_URL}img/icons-write/${currentWeather}.png`} alt="날씨"/>
                              </li>
                            </ul>
                          }

                        </div>
                    </LeftNav1>
                    <LeftNav2>
                    {/* <p>기상청 일기예보</p>
                      { weatherData && weatherData.item.map((info, index) => {
                        return (
                          <div className="weatherInfo" key={index}>
                           <ul>
                            <li className="weathers date">날짜: {info.baseDate[0]}</li> 
                            <li className="weathers time">기준 예보시각: {info.baseTime[0]}</li> 
                           </ul>
                          </div>

                        )
                      })} */}
                        <p>기상청 일기예보</p>
                        <div className="weatherInfo">
                        <ul>
                          {/* {console.log(weatherData.item)}  */}
                          {/* weatherData -> {item: Array(30)}, weatherData.item -> [ baseDate: '20211106',baseTime: '2130',category: 'T1H', fcstDate: '20211107', fcstTime: '0300', fcstValue: '10', nx: 59, ny: 128, ... ] */}
                          {/* { weatherData && weatherData.item.map((info, idx) => { return <li kye={idx}>날짜:{info.baseDate}</li> })[0] }
                          { weatherData && weatherData.item.map((info, idx) => { return <li key={idx}>기준 예보시각: {info.baseTime}</li> })[0] }
                          { weatherData && weatherData.item.map((info, idx) => { return <li key={idx}>현재위치 기온: {info.fcstValue}℃</li> })[24] } 
                          { weatherData && weatherData.item.map((info, idx) => { return <li key={idx}>현재위치 바람세기: {info.fcstValue  < "9" ? "바람세기 약하거나 약간 강함" : info.fcstValue  < "14" ? "바람세기 강함" : "바람세기 매우 강함" }</li> })[54] } 
                          { weatherData && weatherData.item.map((info, idx) => { return <li key={idx}>현재위치 날씨상태: {info.fcstValue === "0" ? "맑음" : info.fcstValue === "1" ? "비" : info.fcstValue === "3" ? "눈" : info.fcstValue === "5" ? "빗방울" : "눈날림" }</li> })[6] }  */}

                          { weatherData && weatherData.item.map((info) => { return <li key={nanoid()}>날짜:{info.baseDate}</li> })[0] }
                          { weatherData && weatherData.item.map((info) => { return <li key={nanoid()}>기준 예보시각: {info.baseTime}</li> })[0] }
                          { weatherData && weatherData.item.map((info) => { return <li key={nanoid()}>현재위치 기온: {info.fcstValue}℃</li> })[24] } 
                          { weatherData && weatherData.item.map((info) => { return <li key={nanoid()}>현재위치 바람세기: {info.fcstValue  < "9" ? "바람세기 약하거나 약간 강함" : info.fcstValue  < "14" ? "바람세기 강함" : "바람세기 매우 강함" }</li> })[54] } 
                          { weatherData && weatherData.item.map((info) => { return <li key={nanoid()}>현재위치 날씨상태: {info.fcstValue === "0" ? "맑음" : info.fcstValue === "1" ? "비" : info.fcstValue === "3" ? "눈" : info.fcstValue === "5" ? "빗방울" : "눈날림" }</li> })[6] } 
                        </ul> 
                        </div>
                    </LeftNav2>
                    <LeftNav3>
                        <p>날씨 기반 추천 코디</p>
                        <div className="codiInfo">
                          {
                            currentOuter=== undefined || currentTop === undefined || currentBottom === undefined ?
                              <p>현재 위치 데이터가 없습니다. 현재위치의 첫 게시물을 올려보세요👍</p>
                            : 
                            <>
                              <Codi src={`${process.env.PUBLIC_URL}img/codi/${currentOuter}.png`} alt="겉옷"></Codi>
                              <Codi src={`${process.env.PUBLIC_URL}img/codi/${currentTop}.png`} alt="상의"></Codi>
                              <Codi src={`${process.env.PUBLIC_URL}img/codi/${currentBottom}.png`} alt="하의"></Codi>
                            </>
                          }

                        </div>
                    </LeftNav3>
                </LeftContainer1>
                  <RightContainer>
                      <RightNav1>
                        <span id="location">주민 예보글</span>
                      </RightNav1>
                      {currentPosts.map((el) => (
                          <div className="userPost" key={el.id}>
                            <img src={el.post_photo} id={el.id} onClick={photoClickHandler}/>
                          </div>
                      ))}
                  </RightContainer>
            </HomeContainer>
        </div>
    )
}
