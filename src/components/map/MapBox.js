import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeSearchword, changeCurLocation, updatePostId } from '../../actions/index';
import $ from 'jquery';
import axios from 'axios';
import { Doughnut, Bar } from '../graph';
import LoadingSpinner from '../common/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

const Box = styled.div`
  width: 50%;
`;

const Box2 = styled.div`
  width: 50%;
`;

const EmoticonBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const PostTitle = styled.div`
  text-align: center;
  background-color: pink;
  border-radius: 10%;
`;

const PostContent = styled.div``;

const PostBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0.5rem;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const PostImg = styled.img`
  width: 100%;
  border-radius: 20%;
`;

const IconImg = styled.img`
  width: 20%;
  cursor: pointer;
`;

const LoadingBoxDiv = styled.div`
  display: flex;
  justify-content: center;
  align-item: center;
  width: 100%;
  flex-direction: column;
  @media ${(props) => props.theme.viewportMin10} {
    width: 100%;
    display: flex;
    justify-content: center;
    align-item: center;
    width: 100%;
    border: 1px solid black;
    flex-direction: column;
  }
`;

const Button = styled.button`
  background-color: ${(props) => (props.bgGrey ? '#E0E0E0' : 'white')};
  color: ${(props) => (props.bgGrey || props.isText ? 'black' : 'grey')};
  font-size: ${(props) => (props.isText ? '1.2rem' : '1.6rem')};
  margin: 0.1rem;
`;

const ImgContainer = styled.div`
  position: relative;
  width: 100%;
  height: var(--mobile-page-height);

  @media ${(props) => props.theme.viewportMin10} {
    height: var(--desktop-page-height);
  }
`;
const PostListModal = styled.div`
  background-color: white;
  z-index: 999;
  position: fixed;
  right: 0;
  bottom: 115px;
  width: 100%;
  height: 50%;
  overflow: auto;
  padding: 0.5rem;
  @media ${(props) => props.theme.viewportMin10} {
    background-color: white;
    z-index: 999;
    position: absolute;
    right: 0;
    bottom: 70px;
    width: 35.3%;
    height: 75%;
    overflow: auto;
  }
`;

const SlideModal = styled.div`
  background-color: white;
  z-index: 9999;
  position: fixed;
  right: 0;
  bottom: 70px;
  width: 100%;
  height: 4%;
  overflow: auto;
  display: flex;
  justify-content: center;
  @media ${(props) => props.theme.viewportMin10} {
    background-color: white;
    z-index: 9999;
    position: absolute;
    bottom: 70px;
    width: 35.3%;
    height: 4%;
    overflow: auto;
    display: flex;
    justify-content: center;
  }
`;
const GraphModal = styled.div`
  width: 50%;
  display: flex;
`;

const GraphTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-weight: bold;
`;
const GraphTitleDiv = styled.div`
  width: 100%;
  text-align: center;
  background-color: pink;
`;
const GraphTitleDiv2 = styled.div`
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
`;
const BarGraphFlex = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const BarGraphchild = styled.div`
  width: 100%;
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function Location() {
  const { searchWord, weatherFilter } = useSelector((state) => state.itemReducer);

  const [isLoading, setisLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const { kakao } = window;
  const [weatherCount, setWeatherCount] = useState({
    sunny: 0,
    cloudy: 0,
    rainy: 0,
    snowy: 0,
  }); //그래프 통계용
  const [weatherApi, setweatherApi] = useState(0);

  const [postList, setPostList] = useState([
    {
      bottom_id: '',
      createdAt: 'Z',
      id: null,
      post_content: '',
      post_photo: '',
      post_title: '예보가 없는 지역 입니다.',
      temp: '',
      top_id: '',
      updatedAt: '',
      user_id: '',
      weather: '',
      wind: '',
      xLocation: null,
      yLocation: null,
    },
  ]);

  useEffect(() => {
    var container = document.getElementById('map');
    var options = {
      center: new kakao.maps.LatLng(37.5642135, 127.0016985),
      level: 3,
    };
    var map = new kakao.maps.Map(container, options); //지도를 생성
    var zoomControl = new kakao.maps.ZoomControl(); //줌컨트롤 생성
    map.addControl(zoomControl, kakao.maps.ControlPosition.LEFT); //줌컨트롤 위치 조정
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
          lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
          message = '<div style="font-align:center;"> 현재 나의 위치</div>'; // 인포윈도우에 표시될 내용입니다

        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
        dispatch(changeCurLocation(lat, lon));
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

      var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
        message = 'geolocation을 사용할수 없어요..';

      displayMarker(locPosition, message);
    }
    // 지도에 마커와 인포윈도우를 표시하는 함수입니다

    function displayMarker(locPosition, message) {
      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
      });

      var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

      // 인포윈도우를 생성합니다
      var infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      // 인포윈도우를 마커위에 표시합니다
      infowindow.open(map, marker);

      // 지도 중심좌표를 접속위치로 변경합니다
      map.setCenter(locPosition);
    }

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(searchWord, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        // var marker = new kakao.maps.Marker({
        //     map: map,
        //     position: coords,
        // })
        // 인포윈도우로 장소에 대한 설명을 표시합니다
        // var infowindow = new kakao.maps.InfoWindow({
        //     content: `<div style="width:150px;text-align:center;padding:6px 0;">${arguments[0][0].road_address.address_name} 지역</div>`,
        // })
        // infowindow.open(map, marker)

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        dispatch(changeSearchword(searchWord));
        map.setCenter(coords);
      }
    });

    //클릭이벤트 함수
    kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
      // 클릭한 위도, 경도 정보를 가져옵니다
      // var latlng = mouseEvent.latLng
      // 마커 위치를 클릭한 위치로 옮깁니다
      // marker.setPosition(latlng)
      //클릭한 곳의 위치 경도를 콘솔로그 찍는 변수
      // var message = "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, "
      // message += "경도는 " + latlng.getLng() + " 입니다"
    });

    var clusterer = new kakao.maps.MarkerClusterer({
      map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
      averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
      minLevel: 9, // 클러스터 할 최소 지도 레벨
    });

    // 데이터를 가져오기 위해 jQuery를 사용합니다
    // 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
    $.get(url + `/post/location?weather=${weatherFilter.weatherFilter}`, function (data) {
      // 데이터에서 좌표 값을 가지고 마커를 표시합니다
      // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다

      var markers = $(data.positions).map(function (i, position) {
        return new kakao.maps.Marker({
          position: new kakao.maps.LatLng(position.xLocation, position.yLocation),
        });
      });
      $(data.positions).forEach((n, idx) => {
        var iwContent = `
                    <container style="border:3px solid pink; padding:5px; height:20rem; width:15rem; display:flex; flex-direction: row; overflow: auto;">
                    <box style="">
                        <h3>${$(data.positions)[n].post_title}</h3>
                            <box style="display:flex; flex-direction: row;">
                        ${
                          $(data.positions)[n].weather === 'sunny'
                            ? "<img src='img/icons-write/sunny.png' style='width:2rem;'/>"
                            : $(data.positions)[n].weather === 'cloudy'
                            ? "<img src='img/icons-write/cloudy.png' style='width:2rem;'/>"
                            : $(data.positions)[n].weather === 'rainy'
                            ? "<img src='img/icons-write/rainy.png' style='width:2rem;'/>"
                            : $(data.positions)[n].weather === 'snowy'
                            ? "<img src='img/icons-write/snowy.png' style='width:2rem;'/>"
                            : null
                        }
                        ${
                          $(data.positions)[n].wind === 'breezy'
                            ? "<img src='img/icons-write/breezy.png' style='width:2rem;'/>"
                            : $(data.positions)[n].wind === 'windy'
                            ? "<img src='img/icons-write/windy.png' style='width:2rem;'/>"
                            : $(data.positions)[n].wind === 'strong'
                            ? "<img src='img/icons-write/strong.png' style='width:2rem;'/>"
                            : null
                        }
                        ${
                          $(data.positions)[n].temp === 'cold'
                            ? "<img src='img/icons-write/cold.png' style='width:2rem;'/>"
                            : $(data.positions)[n].temp === 'hot'
                            ? "<img src='img/icons-write/hot.png' style='width:2rem;'/>"
                            : null
                        }
                        ${
                          $(data.positions)[n].outer_id === '가디건'
                            ? "<img src='img/codi/가디건.png' style='width:2rem;'/>"
                            : $(data.positions)[n].outer_id === '자켓'
                            ? "<img src='img/codi/자켓.png' style='width:2rem;'/>"
                            : $(data.positions)[n].outer_id === '얇은코트'
                            ? "<img src='img/codi/얇은코트.png' style='width:2rem;'/>"
                            : $(data.positions)[n].outer_id === '두꺼운코트'
                            ? "<img src='img/codi/두꺼운코트.png' style='width:2rem;'/>"
                            : $(data.positions)[n].outer_id === '패딩'
                            ? "<img src='img/codi/패딩.png' style='width:2rem;'/>"
                            : $(data.positions)[n].outer_id === 'default'
                            ? "<img src='img/codi/default.png' style='width:2rem;'/>"
                            : null
                        }
                        ${
                          $(data.positions)[n].top_id === '반팔'
                            ? "<img src='img/codi/반팔.png' style='width:2rem;'/>"
                            : $(data.positions)[n].top_id === '셔츠'
                            ? "<img src='img/codi/셔츠.png' style='width:2rem;'/>"
                            : $(data.positions)[n].top_id === '민소매'
                            ? "<img src='img/codi/민소매.png' style='width:2rem;'/>"
                            : $(data.positions)[n].top_id === '긴팔'
                            ? "<img src='img/codi/긴팔.png' style='width:2rem;'/>"
                            : $(data.positions)[n].top_id === '니트'
                            ? "<img src='img/codi/니트.png' style='width:2rem;'/>"
                            : null
                        }
                        ${
                          $(data.positions)[n].bottom_id === '반바지'
                            ? "<img src='img/codi/반바지.png' style='width:2rem;'/>"
                            : $(data.positions)[n].bottom_id === '긴바지'
                            ? "<img src='img/codi/긴바지.png' style='width:2rem;'/>"
                            : null
                        }
                        </box>
                        <img src=${
                          $(data.positions)[n].post_photo
                        } style="padding:5px; max-height:100%; max-width:100%;"></img>
                        <div>${$(data.positions)[n].post_content}</div>
                    </box>
                </container>
                             `, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
          iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다
        // 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: iwRemoveable,
        });
        kakao.maps.event.addListener(markers[n], 'click', function () {
          // 마커 위에 인포윈도우를 표시합니다
          infowindow.open(map, markers[n]);
        });
      });

      clusterer.addMarkers(markers);
    });

    let timer;
    // 지도가 이동, 확대, 축소로 인해 지도영역이 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'idle', function () {
      setisLoading(false);
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(function () {
        var bounds = map.getBounds();
        var swLatlng = bounds.getSouthWest();
        var neLatlng = bounds.getNorthEast();

        axios({
          url: url + `/post/list?top=${neLatlng.La}&bottom=${swLatlng.La}&left=${swLatlng.Ma}&right=${neLatlng.Ma}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }).then((res) => {
          setPostList(res.data);

          let sunny = 0;
          let cloudy = 0;
          let rainy = 0;
          let snowy = 0;

          for (let n = 0; n < res.data.length; n++) {
            if (res.data[n].weather === 'sunny') {
              sunny = sunny + 1;
            } else if (res.data[n].weather === 'cloudy') {
              cloudy++;
            } else if (res.data[n].weather === 'rainy') {
              rainy++;
            } else if (res.data[n].weather === 'snowy') {
              snowy++;
            }
          }

          setWeatherCount({
            sunny: sunny,
            cloudy: cloudy,
            rainy: rainy,
            snowy: snowy,
          });
        });

        var latlng = map.getCenter();

        axios({
          url: url + `/map2?lat=${latlng.Ma}&lon=${latlng.La}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }).then((res) => {
          setweatherApi(res.data.fcstValue);
        });
      }, 1000);
      setisLoading(true);
    });
  }, [kakao.maps, dispatch, searchWord, weatherFilter]);

  const DoughnutData = {
    labels: ['맑음', '구름', '비', '눈'],
    datasets: [
      {
        data: [weatherCount.sunny, weatherCount.cloudy, weatherCount.rainy, weatherCount.snowy],
        backgroundColor: ['#FF6384', 'gray', '#36A2EB', 'silver'],
        hoverBackgroundColor: ['yellow', 'black', 'blue', '#d9d9d9'],
      },
    ],
  };

  const BarData = {
    labels: ['동네 예보', '기상청'],
    datasets: [
      {
        label: '강수 확률',
        backgroundColor: '#697cfa',
        borderColor: '#0022ff',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [
          ((weatherCount.rainy + weatherCount.snowy) /
            (weatherCount.sunny + weatherCount.cloudy + weatherCount.rainy + weatherCount.snowy)) *
            100,
          weatherApi,
        ],
      },
    ],
  };

  const [isOnOff, setisOnOff] = useState(true);

  const postBoxHandler = (e) => {
    let elem = e.target;

    while (!elem.classList.contains('postbox')) {
      elem = elem.parentNode;
      if (elem.classList.contains('mapModal')) {
        elem = null;
        return;
      }
    }

    dispatch(updatePostId(elem.id));
    history.push({
      pathname: '/postread',
      state: { postId: elem.id },
    });
  };

  return (
    <>
      <ImgContainer id='map'></ImgContainer>
      {isOnOff ? (
        <SlideModal>
          <Button onClick={() => setisOnOff(false)}>
            <FontAwesomeIcon icon={faChevronDown} />
          </Button>
        </SlideModal>
      ) : (
        <SlideModal bottom={'70px;'}>
          <Button onClick={() => setisOnOff(true)}>
            <FontAwesomeIcon icon={faChevronUp} />
          </Button>
        </SlideModal>
      )}
      {isOnOff ? (
        <PostListModal>
          {!isLoading ? (
            <LoadingBoxDiv>
              <LoadingSpinner size={'100%;'} />
            </LoadingBoxDiv>
          ) : (
            <div className='mapModal'>
              <GraphTitleDiv>현재동네 날씨정보</GraphTitleDiv>
              <GraphTitle>
                <GraphTitleDiv2>동네 예보 날씨 비율</GraphTitleDiv2>
                <GraphTitleDiv2>동네 예보 vs 기상청예보</GraphTitleDiv2>
              </GraphTitle>
              <GraphModal>
                <Doughnut data={DoughnutData} />
                <BarGraphFlex>
                  <BarGraphchild>
                    <Bar data={BarData} />
                  </BarGraphchild>
                </BarGraphFlex>
              </GraphModal>
              <GraphTitleDiv>동네 예보</GraphTitleDiv>
              {postList.map((post) => {
                return (
                  <PostBox className='postbox' onClick={postBoxHandler} key={post.id} id={post.id}>
                    <Box className='box'>
                      <PostImg className='postImage' src={`${post.post_photo}`} />
                      <EmoticonBox>
                        <IconImg src={`/img/icons-write/${post.weather}.png`} />
                        <IconImg src={`/img/icons-write/${post.wind}.png`} />
                        <IconImg src={`/img/icons-write/${post.temp}.png`} />
                        <IconImg src={`/img/codi/${post.outer_id}.png`} />
                        <IconImg src={`/img/codi/${post.top_id}.png`} />
                        <IconImg src={`/img/codi/${post.bottom_id}.png`} />
                      </EmoticonBox>
                    </Box>
                    <Box2>
                      <PostTitle>{`${post.post_title}`}</PostTitle>
                      <PostContent>{`${post.post_content}`}</PostContent>
                    </Box2>
                  </PostBox>
                );
              })}
            </div>
          )}
        </PostListModal>
      ) : (
        <></>
      )}
    </>
  );
}
