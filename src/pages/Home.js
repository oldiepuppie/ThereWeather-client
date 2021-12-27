import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { updateWeatherInfo, updatePostId } from '../actions/index';
import { useHistory } from 'react-router-dom';
import { nanoid } from 'nanoid';
import TopButton from '../components/common/TopButton';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  padding-right: 5vh;
  background-color: var(--page-bg-color);

  ul {
    list-style: none;
  }

  @media screen and (min-width: 3000px) {
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
`;

const TodaysDate = styled.div`
  background-color: var(--page-bg-color);
  margin: 0 auto;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  #curDate {
    padding-left: 2vw;
  }

  #curLocation {
    padding-right: 2vw;
  }

  @media screen and (min-width: 1500px) {
    width: 90%;
    #curDate {
      padding-left: 0;
    }
    #curLocation {
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
`;

const LeftContainer1 = styled.div`
  display: flex;
  gap: 0.1rem;
  flex-direction: row;
  width: 40vw;
  flex-wrap: wrap;

  .weatherInfo {
    text-align: center;
    line-height: 3rem;
    li {
      align-items: center;
    }
    img {
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
    img {
      width: 3rem;
      height: 3rem;
    }
  }
`;

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
    border-bottom: 1px solid #8e8e8e;
  }
`;

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
    border-bottom: 1px solid #8e8e8e;
  }
`;

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

  .codiInfo {
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
      border-bottom: 1px solid #8e8e8e;
      p {
        font-size: 1rem;
        margin: 1vh 0;
      }
    }
  }
`;

const Codi = styled.img`
  width: 7rem;
  height: 7rem;
  border: purple;

  @media screen and (max-width: 400px) {
    width: 5rem;
    height: 5rem;
  }
`;

const RightContainer = styled.div`
  display: grid;
  width: 80vw;
  grid-template-rows: 0.5fr 2.3fr 2.3fr 2.3fr;
  grid-template-columns: 1fr 1fr 1fr;
  grid-area: 'nav nav' 'main main' 'main main';
  grid-gap: 0.1rem;
  transition: all 0.01s ease-in-out;
  .userPost {
    &:hover {
      border-bottom: 1px solid #fafafa;
    }
  }

  @media (max-width: 600px) {
    .userPost:nth-last-child(1) {
      display: none;
    }
    grid-template-rows: 0.5fr 1.5fr 1.5fr 1.5fr 1.5fr;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'nav'
      'main';
  }

  .userPost {
    text-align: center;
  }

  img {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 1081px) {
    margin: 0 auto;
    width: 100%;
  }
`;

const RightNav1 = styled.nav`
  margin-top: 0.8rem;
  text-align: center;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'nav nav';
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
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function Home() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { curLocation } = useSelector((state) => state.itemReducer);

  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude,
          lon = position.coords.longitude;
        axios({
          url: url + '/map',
          method: 'post',
          data: { lat: lat, lon: lon },
          withCredentials: true,
        }).then((res) => {
          setWeatherData(res.data);
          dispatch(updateWeatherInfo(res.data));
        });
      });
    }
  }, [dispatch]);

  const [curAddress, setcurAddress] = useState('');
  const [currentPosts, setcurrentPosts] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function () {
        let lat = curLocation.lat,
          lon = curLocation.lon;
        let right = lat + 0.02112925;
        let left = lat - 0.02112925;
        let top = lon + 0.03750225;
        let bottom = lon - 0.03750225;

        axios({
          url: url + '/home',
          method: 'post',
          data: {
            lat: lat,
            lon: lon,
            right: right,
            left: left,
            top: top,
            bottom: bottom,
          },
          withCredentials: true,
        }).then((res) => {
          setcurrentPosts(res.data.curtPost);
          setcurAddress(res.data.address);
        });
      });
    }
  }, [curLocation.lat, curLocation.lon]);

  const [todaysDate, setTodaysDate] = useState('');

  useEffect(() => {
    let date = new Date();
    const formatDate = (currentDate) => {
      let formatted = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
      return formatted;
    };

    setTodaysDate(formatDate(date));
  }, []);

  // TODO 날씨, 코디 가져오기, 추후 수정
  let [currentTemp, setcurrentTemp] = useState('');
  let [currentWind, setcurrentWind] = useState('');
  let [currentWeather, setcurrentWeather] = useState('');
  let [currentOuter, setcurrentOuter] = useState('');
  let [currentTop, setcurrentTop] = useState('');
  let [currentBottom, setcurrentBottom] = useState('');

  useEffect(() => {
    let tempArr = [];
    let windArr = [];
    let weatherArr = [];
    let outerArr = [];
    let topArr = [];
    let bottomArr = [];

    for (let i = 0; i < currentPosts.length; i++) {
      tempArr.push(currentPosts[i].temp); // temp키만 가져옴
      windArr.push(currentPosts[i].wind);
      weatherArr.push(currentPosts[i].weather);
      outerArr.push(currentPosts[i].outer_id);
      topArr.push(currentPosts[i].top_id);
      bottomArr.push(currentPosts[i].bottom_id);
    }

    function getCount(arr) {
      return arr.reduce((pv, cv) => {
        pv[cv] = (pv[cv] || 0) + 1;
        return pv;
      }, {});
    }

    let tempObj = getCount(tempArr);
    let windObj = getCount(windArr);
    let weatherObj = getCount(weatherArr);
    let outerObj = getCount(outerArr);
    let topObj = getCount(topArr);
    let bottomObj = getCount(bottomArr);

    let newTempArr = Object.values(tempObj); // [6, 3]
    let newWindArr = Object.values(windObj);
    let newWeatherArr = Object.values(weatherObj);
    let newOuterArr = Object.values(outerObj);
    let newTopArr = Object.values(topObj);
    let newBottomArr = Object.values(bottomObj);

    let tempMaxNum = Math.max(...newTempArr); // 6
    let windMaxNum = Math.max(...newWindArr);
    let weatherMaxNum = Math.max(...newWeatherArr);
    let outerMaxNum = Math.max(...newOuterArr);
    let topMaxNum = Math.max(...newTopArr);
    let bottomMaxNum = Math.max(...newBottomArr);

    function matchKey(obj, maxNum) {
      for (let key in obj) {
        if (obj[key] === maxNum) {
          return key;
        }
      }
    }

    let maxTemp = matchKey(tempObj, tempMaxNum);
    let maxWind = matchKey(windObj, windMaxNum);
    let maxWeather = matchKey(weatherObj, weatherMaxNum);
    let maxOuter = matchKey(outerObj, outerMaxNum);
    let maxTop = matchKey(topObj, topMaxNum);
    let maxBottom = matchKey(bottomObj, bottomMaxNum);

    setcurrentTemp(maxTemp);
    setcurrentWind(maxWind);
    setcurrentWeather(maxWeather);
    setcurrentOuter(maxOuter);
    setcurrentTop(maxTop);
    setcurrentBottom(maxBottom);
  }, [currentPosts]);

  const photoClickHandler = (e) => {
    let elem = e.target;

    dispatch(updatePostId(elem.id));
    history.push({
      pathname: '/postread',
      state: { postId: elem.id },
    });
  };

  return (
    <div className='homecontainer'>
      <TopButton />
      <TodaysDate>
        <p id='curDate'>날짜 : {todaysDate}</p>
        <p id='curLocation'>위치 : {curAddress}</p>
      </TodaysDate>
      <HomeContainer>
        <LeftContainer1>
          <LeftNav1>
            <p>주민예보</p>
            <div className='weatherInfo'>
              {currentTemp === undefined && currentWind === undefined && currentWeather === undefined ? (
                <p>현재 날씨 데이터가 없습니다. </p>
              ) : (
                <ul>
                  <li>
                    <span>현재위치 체감온도 </span>
                    <img src={`${process.env.PUBLIC_URL}img/icons-write/${currentTemp}.png`} alt='온도' />
                  </li>
                  <li>
                    <span>현재위치 바람세기 </span>
                    <img src={`${process.env.PUBLIC_URL}img/icons-write/${currentWind}.png`} alt='바람' />
                  </li>
                  <li>
                    <span>현재위치 날씨상태 </span>
                    <img src={`${process.env.PUBLIC_URL}img/icons-write/${currentWeather}.png`} alt='날씨' />
                  </li>
                </ul>
              )}
            </div>
          </LeftNav1>
          <LeftNav2>
            <p>기상청 일기예보</p>
            <div className='weatherInfo'>
              <ul>
                {
                  weatherData.item.map((info) => {
                    return <li key={nanoid()}>날짜:{info.baseDate}</li>;
                  })[0]
                }
                {
                  weatherData.item.map((info) => {
                    return <li key={nanoid()}>기준 예보시각: {info.baseTime}</li>;
                  })[0]
                }
                {
                  weatherData.item.map((info) => {
                    return <li key={nanoid()}>현재위치 기온: {info.fcstValue}℃</li>;
                  })[24]
                }
                {
                  weatherData.item.map((info) => {
                    return (
                      <li key={nanoid()}>
                        현재위치 바람세기:{' '}
                        {info.fcstValue < '9'
                          ? '바람세기 약하거나 약간 강함'
                          : info.fcstValue < '14'
                          ? '바람세기 강함'
                          : '바람세기 매우 강함'}
                      </li>
                    );
                  })[54]
                }
                {
                  weatherData.item.map((info) => {
                    return (
                      <li key={nanoid()}>
                        현재위치 날씨상태:{' '}
                        {info.fcstValue === '0'
                          ? '맑음'
                          : info.fcstValue === '1'
                          ? '비'
                          : info.fcstValue === '3'
                          ? '눈'
                          : info.fcstValue === '5'
                          ? '빗방울'
                          : '눈날림'}
                      </li>
                    );
                  })[6]
                }
              </ul>
            </div>
          </LeftNav2>
          <LeftNav3>
            <p>날씨 기반 추천 코디</p>
            <div className='codiInfo'>
              {currentOuter === undefined || currentTop === undefined || currentBottom === undefined ? (
                <p>현재 위치 데이터가 없습니다. 현재위치의 첫 게시물을 올려보세요👍</p>
              ) : (
                <>
                  <Codi src={`${process.env.PUBLIC_URL}img/codi/${currentOuter}.png`} alt='겉옷'></Codi>
                  <Codi src={`${process.env.PUBLIC_URL}img/codi/${currentTop}.png`} alt='상의'></Codi>
                  <Codi src={`${process.env.PUBLIC_URL}img/codi/${currentBottom}.png`} alt='하의'></Codi>
                </>
              )}
            </div>
          </LeftNav3>
        </LeftContainer1>
        <RightContainer>
          <RightNav1>
            <span id='location'>주민 예보글</span>
          </RightNav1>
          {currentPosts.map((el) => (
            <div className='userPost' key={el.id}>
              <img src={el.post_photo} id={el.id} onClick={photoClickHandler} alt='posted pictures' />
            </div>
          ))}
        </RightContainer>
      </HomeContainer>
    </div>
  );
}
