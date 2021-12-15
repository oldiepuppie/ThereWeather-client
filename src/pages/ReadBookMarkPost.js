import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { Bookmark } from "../components/Heart";
import ModalConfirm from "../components/ModalConfirm";
import GoBackButton from  "../components/GoBackButton";
import { useHistory } from "react-router-dom";
import TopButton from "../components/TopButton";

/*
  [수정사항]
  - 옷차림 아이콘 경로 수정
  - select 태그용 배열 테스트
  - 게시물 작성 위치를 기준으로 주소 렌더링
  - 하단의 주석 제거
  - '잘못된 요청입니다' 메시지 h2에 margin 추가
*/

const Outer = styled.div`
  width: 100vw;
  background-color: var(--page-bg-color);

  // 오늘의 코디
  .todayCodi{
    margin: 0 auto;
    width: 60%;
    text-align: center;
    color: #2E2E2E;
    padding-top: 2vh;
    border-top: 1px solid #aaa;
  }

  h2.warning--nodata {
    color: #c60239;
    font-size: 3rem;
    margin: 0 1rem;
  }

  @media screen and (max-width: 1081px){
    .todayCodi{
      margin-top: 2vh;
      font-weight: bold;
    }
  }
  @media screen and (max-width: 375px) {
  }
`
// 제목, 유저프로필사진,닉네임 북마크버튼
const PostHeader = styled.div`
  padding-top: 8vh;
  align-items: center;

  @media screen and (max-width: 1081px) {
    padding-top: 5vh;
  }
`
// 제목 // 제목글자수 제한 필요?
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 960px;
  text-align: center;
  margin: 0 auto;

  span{
    font-size: 2rem;
  }

  @media screen and (max-width: 1081px) {
    width: 70%;
  }
  @media screen and (max-width: 375px) {
    span{
      font-size: 1.2rem;
    }
  }
`

// 북마크 아이콘
const BookmarkIcon = styled(Bookmark)`
  float: right;

  & .heart{
    cursor: pointer;
    color: #aaa;
  }
`


// 프로필
const Profile = styled.div`
  width: 60rem;
  margin: 0 auto;
  margin-top: 2vh;
  padding-bottom: 3vh;
  border-bottom: 1px solid #aaa;
  align-items: center;
  display: flex; 
  justify-content: space-between;
  flex-flow: wrap;

  .profileInfo{
    display: flex; 
    align-items: center;
    /* margin-left: 1vh; */
  }
  .location{
    font-size: 1.2rem;
  }
  span{
    margin-left: 1vh;
  }
  span.date {
    font-size: .8rem;
    color: #707B7C;
  }

  @media screen and (max-width: 1081px) {
    width: 70%;
  }
  @media screen and (max-width: 594px) {
    .location{
      margin-top: 1.2vh;
      font-size: 1.2rem;
    }
  }
  @media screen and (max-width: 375px) {
    width: 80%;
    margin-top: 4vh;
    span{
      font-size: 0.5rem;
    }
    .location{
      font-size: 0.5rem;
    }
  }
`
// 프로필 이미지
const ProfileImg = styled.img`
  border: 1px solid #aaa;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  @media screen and (max-width: 375px) {
    width: 2rem;
    height: 2rem;
  }
`

// 게시물 사진 (있을 때, 없을때)
const PostImg = styled.img`
  // 이미지 사이즈(1000*750) 
  // 다시 확인필요
  width: 60rem;
  height: 40rem;
  display: block;
  margin: 3vh auto;

  @media screen and (max-width: 1081px) {
    width: 70%;
    height: 30rem;
  }
  @media screen and (max-width: 375px) {
    width: 80%;
    height: 18rem;
  }
`

// 날씨,바람세기,온도 이모티콘 부분
const WeatherInfo = styled.div`
  width: 330px;
  margin-top: 4vh;
  display: flex;
  margin: 0 auto;
  margin-bottom: 2vh;
  justify-content: space-between;

  @media screen and (max-width: 1081px) {
    margin-top: 1vh;
    margin-bottom: 1vw;
    justify-content: space-around;
  }
  @media screen and (max-width: 375px) {
    width: 50%;
    margin-bottom: 3vh;
  }
`

const Icon = styled.img`
  @media screen and (max-width: 1081px) {
    width: 4rem;
  }
  @media screen and (max-width: 375px) {
    width: 3rem;
  }
`

// 오늘의 코디 (있을 때, 없을 때)
const TodayCodi = styled.div`
  width: 20%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items:center;
  margin: auto;
  margin-top: 3vh;
  margin-bottom: 3vh;
  .warning{
    display: none;
  }
  & p.warning {
    font-size: .9rem;
    width: 6rem;
    height: 6rem;
    text-align: center;
  }

  img {
    width: 4rem;
    height: auto;
  }

  @media screen and (max-width: 1081px) {
    width: 50%;
  }
  @media screen and (max-width: 375px) {
    width: 50vw;
  }
`

// 게시물 내용 scroll
const Post = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 auto;
  margin-bottom: 5vh;
  padding: 1rem;
  width: 60rem;

  p{
    line-height: 2.5rem;
    font-size: 1.5rem;
  }

  @media screen and (max-width: 1081px) {
    width: 70%;
  }
  @media screen and (max-width: 375px) {
    width: 85%;
    margin-top: 4vh;
    p{
      line-height: 1.5rem;
      font-size: 1rem;
    }
  }
`

// 삭제, 수정 버튼
const Buttons = styled.div`
  width: 15rem;
  margin: 0 auto;
  padding-bottom: 10vh;

  .button{
    width: 5rem;
    height: 3rem;
    border-radius: 5px;
    background-color: var(--button-bg-normal);
    font-size: 1.2rem;
  }
  .button2{
    margin-left: 5rem;
  }
  .button:before{
    height: 0%;
    width: 2px;
  }
  .button:active{
    border: none;
    box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
    inset -4px -4px 6px 0 rgba(255,255,255,.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .4);
  }

  @media screen and (max-width: 1081px) {
    .button2{
      margin-left: 80px;
    }
  }
  @media screen and (max-width: 375px) {
    width: 40%;
    display: flex;
    justify-content: space-between;
    .button{
      width: 3rem;
      height: 2rem;
      font-size: 1rem;
    }
    .button2{
      margin-left: 0;
    }
  }
`

let url = process.env.REACT_APP_LOCAL_URL
if (!url) url = "https://thereweather.space"

export default function PostRead(){
  const history = useHistory()
  const { readPostId, userInfo, postInfo } = useSelector(state => state.itemReducer);
  console.log(userInfo) //현재접속한 유저 
  console.log(readPostId) //포스트번호 
  console.log(postInfo) //본인것만 보임
  // console.log(pagePostInfo)
  const postIds = Number(readPostId)
  console.log(postIds) 

  // postData state 변수
  const [postData, setPostData] = useState({
    id: null,
    post_title: '',
    user_id: '',
    createdAt: '',
    updatedAt: '',
    xLocation: '',
    yLocation: '',
    post_photo: '',
    weather: '',
    wind: '',
    temp: '',
    top_id: '',
    bottom_id: '',
    post_content: '',
    address: ''
  });
  const [ noIdWarning, setNoIdWarning ] = useState('');

  // 날짜 처리
  const formatDate = (dateString) => {
    // 예시 : 2021. 11. 5. 22:02
    const dateObject = new Date(dateString);
    let dateOnly = dateObject.toLocaleDateString();
    let hourAndMin = dateObject.toLocaleTimeString('en-US', { hour12: false });
    hourAndMin = hourAndMin.slice(0, -3);

    return `${dateOnly} ${hourAndMin}`
  }

  // 글 불러오기
  useEffect(() => {
    function getOnePost(postId) {
      axios.get(`${url}/readpost`, {
        headers: { "Content-Type": "application/json" },
        params: { id: postId },
        withCredentials: true
      })
      .then (res => {
        console.log(res.data);
        return setPostData(prev => res.data);
        // return res.data;
      })
      .catch (err => console.log(err));
    };

    let id;
    if (history.location.state) {
      id = history.location.state.postId;
    } else {
      id = readPostId;
    }

    if (!id) {
      console.log('**postread: id가 없습니다**');
      setNoIdWarning(prev => '잘못된 접근입니다.');
    } else {
      getOnePost(id);
    }
  }, [])

  // 북마크 상태
  const [bookmarked, setBookmarked] = useState(false);

  // const [isOpen, setIsOpen] = useState(false);
  // 게시물 수정
  const [edit, setEdit] = useState(false)
  // 게시물 삭제
  const [removePost, setRemovePost] = useState(false)

  // 게시물 수정
  const editPost = () => {
    console.log('수정버튼동작확인');
    setEdit(true);
  }

  // 게시물 삭제
  const deletePost = (e) => {
    console.log('삭제버튼동작확인');
    setRemovePost(true);
  }

  //게시물 수정 yse버튼 
  const editModalYes = () => {
    axios({
      url: url + "/editpost",
      method: "put",
      data: {
        user_id: userInfo.user_id,
        post_id: postIds
      },
      withCredentials: true
    })
    .then((res) => {
      alert(res.data)
      if(res.data === "게시물의 작성자가 아닙니다."){
        history.push("/mypage");
      }
      else{
        history.push("/editpost");
      }
    })
    setEdit(false);
  }

  //게시물 삭제 yes버튼 
  const removeModalYes = () => {
    // console.log('삭제완료')
    const token = JSON.parse(localStorage.getItem("ATOKEN"))
    //console.log(token)
    axios({
      url:  url + "/deletepost",
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      data: { post_id: postIds },
      withCredentials: true
    })
    .then((res) => {
      console.log(res.data)
      alert(res.data)
      // alert("삭제 완료")
      history.push("/mypage")
    })
    setRemovePost(false)
  }

  const modalNoButtonHandler = () => {
    setRemovePost(false)
    setEdit(false)
  }

  const modalCloseButtonHandler = () => {
    setRemovePost(false)
    setEdit(false)
  }

  const bookmarkHandler = (e) => {
    console.log('글 읽기 - 북마크 버튼 동작 확인');
    //눌렀을 때 북마크에 저장
    //다시 누르면 해제
      axios({
        url: url + '/bookmark',
        method: "post",
        data: { user_id: userInfo.id, post_id: postIds },
        // data: { post_id: postId },
        headers: {  "Content-Type": "application/json" },
        withCredentials: true,
      })
    .then((res) => {
      console.log(res.data)
      setBookmarked(prev => !prev);
      // history.push("/bookmark")  
    })  
  // console.log(e.currentTarget);
  }

  return (
    <Outer>
      {
        noIdWarning.length !== 0 ?
          <h2 className="warning--nodata">{noIdWarning}</h2>
        :
          ''
      }
      <TopButton/>
      <GoBackButton/>
      <PostHeader className="postHeader">
        <Title className="title">
          <span>{postData.post_title}</span>
          <BookmarkIcon
            bookmarkHandler={bookmarkHandler}
            color={bookmarked ? '#aaa' : '#ED4956' }
          />
         
        </Title>

        <Profile className="userProfile">
          <div className="profileInfo">
            <ProfileImg src={postData.user_Photo}/>
            <span className="nickName">{postData.nickName}</span>
            <span className="date">
              {formatDate(postData.updatedAt)}
            </span>
          </div>
          <div>
            <p className="location">{postData.address}</p>
            {/* <p className="location">{postData.xLocation.slice(0, -8)}</p>
            <p className="location">{postData.yLocation.slice(0, -8)}</p> */}
          </div>
        </Profile>
      </PostHeader>
      <PostImg src={postData.post_photo} alt="post picture" />

      <WeatherInfo>
          {
            !postData.weather?
              ''
            :
              <Icon src={`${process.env.PUBLIC_URL}img/icons-write/${postData.weather}.png`} alt="날씨아이콘"/>
          }
          {
            !postData.wind?
              ''
            :
              <Icon src={`${process.env.PUBLIC_URL}img/icons-write/${postData.wind}.png`} alt="바람아이콘"/>
          }
          {
            !postData.temp?
              ''
            :
              <Icon src={`${process.env.PUBLIC_URL}img/icons-write/${postData.temp}.png`} alt="날씨아이콘"/>
          }
      </WeatherInfo>

      {/* 코디가 있을 때, 없을 때 */}
      {
        // 코디 3개 없을때
        (!postData.outer_id || postData.outer_id === 'default') && (!postData.top_id || postData.top_id === 'default') && (!postData.bottom_id || postData.top_id === 'default') ?
          null
        :
          <>
          <h2 className="todayCodi">오늘의 코디</h2>
          <TodayCodi>
            {
              !postData.outer_id || postData.outer_id === 'default' ?
              <p className="warning">겉옷 데이터가 없습니다</p>
              :
                <Icon src={`${process.env.PUBLIC_URL}img/codi/${postData.outer_id}.png`} alt="겉옷" />
            }
            {
              !postData.top_id || postData.top_id === 'default' ?
                <p className="warning">상의 데이터가 없습니다</p>
              :
                <Icon src={`${process.env.PUBLIC_URL}img/codi/${postData.top_id}.png`} alt="상의" />
            }
            {
              !postData.bottom_id || postData.top_id === 'default' ?
                <p className="warning">하의 데이터가 없습니다</p>
              :
                <Icon src={`${process.env.PUBLIC_URL}img/codi/${postData.bottom_id}.png`} alt="하의" />
            }
          </TodayCodi>
          </>
      }

      <Post>
        <p>
          {postData.post_content}
        </p>
      </Post>

      <Buttons>
        <button className="button button1" value="delete" onClick={deletePost}>삭제</button>
        {removePost === false ? null : (
          <ModalConfirm
            yesHandler={removeModalYes}
            noHandler={modalNoButtonHandler}
            closeHandler={modalCloseButtonHandler}
          >삭제하시겠습니까?</ModalConfirm>
          )}
        <button className="button button2" onClick={editPost}>수정</button>
        {edit === false ? null : (
          <ModalConfirm
            yesHandler={editModalYes}
            noHandler={modalNoButtonHandler}
            closeHandler={modalCloseButtonHandler}
          >수정하시겠습니까?</ModalConfirm>
        )}
      </Buttons>
    </Outer>
  )
}