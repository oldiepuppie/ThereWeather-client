import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import axios from "axios"
import { userPosts, updatePostId } from "../actions/index"
// UPDATE_CURRENT_PAGE, UPDATE_START_END_PAGE
import GoBackButton from "../components/GoBackButton"
import Pagination from "../components/Pagination"

const Outer = styled.div`
  position: relative;
  background-color: var(--page-bg-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding: 2rem;

  h2 {
    align-self: flex-start;
    margin: 2rem 0;
  }

  button{
    font-size: 1.5rem;
  }

  @media screen and (min-width: 1500px) {
    // 제일 큰 사이즈
    padding-left: 3vh;
    padding-right: 3vh;
  }
  @media screen and (max-width: 375px) {
    padding-top: 2vh;
  }
  @media screen and (max-width: 1081px) {
    // 1080이하
  }
`

// 내가 쓴 글 (grid)
const GridArea = styled.div`
    // border: 1px solid blue;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 300px 300px ;
    grid-gap: 1.5rem;
    min-height: 70vh;
    margin: 1rem;
    p{
      font-size: 28px;
    }

    .postItem {
      background-color: rgba(255, 255, 255, 0.6);
      display: flex;
    }
    .postItem:hover {
      border: 1px solid #D5D8DC;
    }
    @media screen and (min-width: 2100px) {
        height: 50vh;
        width: 300px;
    }
    @media screen and (max-width: 1081px) {
      padding-left: 5vw;
      padding-right: 5vw;
      height: auto;
      grid-template-columns: 1fr 1fr;
    }
    @media screen and (max-width: 600px) {
      padding-left: 2vw;
      padding-right: 2vw;
      p{
        font-size:20px
      }
    }
    @media screen and (max-width: 375px) {
      height: auto;
    }
`

// 게시물 사진
const PostImg = styled.img`
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;

  @media screen and (min-width: 2100px) {
    width: 300px;
    height: 300px;
  }

  @media screen and (max-width: 1081px) {
    // 이미지 크기 수정 필요
  }
`

//   @media screen and (max-width: 1081px) {
//     padding: 1vh 2vw 2vh 2vw;
//     font-size: 1.5rem;
//   }
//   @media screen and (max-width: 375px) {
//     font-size: 1rem;
//     padding-left: 3vw;
//   }
// `

// 페이지네이션
const Page = styled.div`
    display: flex;
    justify-content: center;
    li {
      /* margin: 3px; */
      list-style: none;
      padding: 3px;
      /* border: 1px solid red; */
    }
    button {
      margin: 0 1vw;
      padding: 1rem 1.5rem;
      border-radius: 50%;
    }
    button:focus{
      background-color: var(--modal-bg-color);
    }
    #prev,
    #next{
      background: none;
    }
    @media screen and (max-width: 1081px) {
      margin-top: 10rem;
      padding-bottom: 5rem;

    }

    @media screen and (max-width: 375px) {
      margin-top: 3rem;
      padding-bottom: 3rem;
      li {
        /* margin: 0 1vw; */
        /* margin: 1vh; */
        padding: 0;

      }
      button {
        /* margin: 0 1.5vw; */
        font-size: 1.5rem;
        margin: 0;
        padding: 1px 7px;
      }
    }
`


let url = process.env.REACT_APP_LOCAL_URL
if (!url) url = "https://thereweather.space"


export default function MyPost() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { start, end, current, isLogin, userInfo, postInfo, readPostId } = useSelector((state) => state.itemReducer)

  const [currentPosts, setcurrentPosts] = useState([]);

  useEffect(() => {
    axios({
        url: url + `/mypost?searchID=${userInfo.user_id}`,
        method: "get",
        withCredentials: true,
    }).then((res) => {
        //console.log(res.data)
        setcurrentPosts(res.data)
        dispatch(userPosts(res.data))
    })
  }, [])

  // 페이지네이션 시작
  const [ currentPage, setCurrentPage ] = useState(1);
    // 1페이지로 시작
  const itemsPerPage = 8;
    // 한 페이지에 8개씩 보여준다
  const lastIdx = currentPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const slicedData = (dataArr) => {
    return dataArr.slice(firstIdx, lastIdx);
  }
  // 페이지네이션 끝

  // 게시물사진 클릭했을 때
  const postClickHandler = (e) => {
    let elem = e.target;
    while(!elem.classList.contains("postItem")) {
        elem = elem.parentNode;
        if(!elem.classList.contains("myPostList")) {
            break;
        }
    }

    dispatch(updatePostId(elem.id));
    history.push({
        pathname: '/postread',
        state: {postId: elem.id}
    });
  }

  return (
    <Outer className="MyPostPage">
      <div>
        <GoBackButton className="gobackButton" />
        <h2>내가 쓴 게시물</h2>
      </div>

      <GridArea className="myPostList">
        { /* 페이지 분할 및 적용 */
          slicedData(currentPosts).map((el) =>
          <div className={["postItem"]} id={el.id} onClick={postClickHandler} key={el.id}>
            <PostImg src={el.post_photo} alt="posts"/>
          </div>)
        }
      </GridArea>

      <div className="paginationContainer">
        <Pagination
          dataLength={currentPosts.length}
          itemsPerPage={itemsPerPage}
          numberButtonClickHandler={setCurrentPage}
        />
      </div>
    </Outer>
  )
}