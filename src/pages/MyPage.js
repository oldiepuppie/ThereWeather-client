import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import ModalConfirm from "../components/ModalConfirm"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { changeIsLogin, userPosts, updatePostId } from "../actions/index"
import GoBackButton from "../components/GoBackButton"

/*
    [수정]
    - 페이지네이션 추가
    - 주석, console.log 정리
*/

const Outer = styled.div`
    background-color: var(--page-bg-color);
    width: 100vw;
    min-height: calc(100vh - 125px);
    position: relative;
    display: flex;
    padding-bottom: 100px;

    @media screen and (max-width: 1081px) {
        flex-direction: column;
        min-height: calc(100vh - 125px - 70px);
    }
`
/* 프로필 정보 */
const ProfileArea = styled.div`
    width: 30%;
    padding: 15vh 1vw 1vh 1vw;
    text-align: center;
    button {
        // 비밀번호 수정, 회원탈퇴
        color: #336fc9;
        font-size: 1.5rem;
        margin-top: 1vh;
    }
    .mediaBox {
        margin-top: 2vh;
        margin-bottom: 2vh;
        p {
            margin-top: 1vh;
        }
        #user-name {
            font-size: 1.5rem;
            font-weight: bold;
        }
        #user-changeInfo {
            color: #336fc9;
        }
    }

    @media screen and (max-width: 1081px) {
        /* border-bottom: 1px solid #aaa;  // 구분선 추가 */
        margin: 0 auto;
        margin-top: 4vh;
        width: 100%;
        padding: 0 1vw 3vh 1vw;
        .mediaBox {
            width: 40%;
            display: inline-block;
            text-align: left;
            p {
                margin-top: 2vh;
                justify-content: center;
                line-height: 3vh;
                font-size: 1.2rem;
            }
        }
    }

    @media screen and (max-width: 375px) {
        button {
            font-size: 1rem;
        }
        .mediaBox {
            width: 50%;
            display: inline-block;
            padding-bottom: 1vh;
            p {
                margin-top: 0;
                justify-content: center;
                font-size: 1rem;
            }
            #user-name {
                font-size: 1rem;
            }
        }
    }
`
/* 프로필 사진 */
const ProfileImg = styled.img`
    width: 200px;
    height: 200px;
    padding: 10px 10px;
    border-radius: 50%;
    @media screen and (max-width: 1081px) {
        margin-right: 5vw;
    }
    @media screen and (max-width: 375px) {
        width: 7rem;
        height: 7rem;
    }
`

/* 비밀번호수정, 탈퇴 */
const ButtonArea = styled.div`
    height: 10vh;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    text-decoration: none;

    button {
        font-size: 1.2rem;
    }

    @media screen and (max-width: 1081px) {
        width: 100vw; // 가운데로 맞춤
        align-items: center;
        height: 10vh;
        position: absolute;
        bottom: 0;
    }
    @media screen and (max-width: 375px) {
        padding: 0 15vw;
        height: 20vh;
        justify-content: space-between;
        button {
            font-size: 1rem;
        }
    }
`

// 내가 쓴 예보 (grid)
const GridArea = styled.div`
    width: 100vw;
    padding: 2vh 3vw 2vh 5vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 200px 1fr 1fr;

    row-gap: 10px; /* row의 간격을 10px로 */
    column-gap: 20px; /* column의 간격을 20px로 */
    // border-top: 1px solid #aaa; // 구분선 추가 // header와 외곽선이 겹쳐서 주석처리합니다 ㅜㅜ

    .item:nth-child(1) {
        border: none;
        grid-column: 1 / 4;
        grid-row: 1 / 2;
    }

    div {
        background-color: rgba(255, 255, 255, 0.5); // 추가
    }
    div:hover {
        border: 1px solid var(--page-bg-color);
    }
    img {
        width: 100%;
        height: 100%;
    }
    .more {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        background-color: transparent;
    }
    p {
        font-size: 2rem;
        margin: 0 auto;
        font-weight: bold;
        color: #8e8e8e;
    }
    .moreView {
        font-size: 1.5rem;
        color: #336fc9;
        width: 5vw;
    }

    @media screen and (max-width: 1380px) {
        .moreView {
            font-size: 1.4rem;
            width: 6vw;
        }
    }

    @media screen and (max-width: 1081px) {
        margin: 0 auto;
        margin-bottom: 10vh;
        padding: 0;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 100px 300px 300px;
        row-gap: 5px;
        column-gap: 3px;

        p {
            font-size: 2rem;
        }
        .item {
            margin: 0.5vh;
        }
        .moreView {
            width: 80px;
        }
    }

    @media screen and (max-width: 600px) {
        padding-left: 2vw;
        padding-right: 2vw;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 50px 150px 150px 150px;
        .item:nth-child(1) {
            border: none;
            grid-column: 1 / 3;
            grid-row: 1 / 2;
        }
        p {
            font-size: 1rem;
        }
        .moreView {
            font-size: 1rem;
            width: 50px;
            height: 3rem;
        }
    }
`

let url = process.env.REACT_APP_LOCAL_URL
if (!url) {
    url = "https://thereweather.space"
}


export default function MyPage() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { isLogin, userInfo, postInfo, readPostId } = useSelector(
        (state) => state.itemReducer
    )
    console.log(userInfo) //정보잘넘어옴
    console.log(postInfo.postinfo)
    console.log(readPostId)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [removeUser, setremoveUser] = useState(false)

    const [currentPosts, setcurrentPosts] = useState([])

  
    const [ noIdWarning, setNoIdWarning ] = useState('');
    // 게시물 데이터 조회
    useEffect(() => {
        axios({
            url: url + `/mypage?searchID=${userInfo.user_id}`,
            method: "get",
            withCredentials: true,
        }).then((res) => {
            setcurrentPosts(res.data)
            dispatch(userPosts(res.data))
        })
    }, [])


    // 정보수정
    const changeUserInfo = () => {
        //console.log("정보수정 클릭")
        history.push("/edituserinfo")
    }

    const removeUserInfo = () => {
        setIsModalOpen(true)
    }

    const modalYesButtonHandlers = () => {
        const token = JSON.parse(localStorage.getItem("ATOKEN"))
        axios
            .delete(url + "/removeuser", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `token ${token}`,
                },
                withCredentials: true,
            })
            .then((res) => {
                localStorage.clear(token)
                dispatch(changeIsLogin(false))
                history.push("/")
            })
        //setIsModalOpen(false)
    }

    const modalNoButtonHandler = () => {
        setIsModalOpen(false)
    }
    const modalCloseButtonHandler = () => {
        setIsModalOpen(false)
    }

    // 게시물 클릭했을 때
    const postClickHandler = (e) => {
        let elem = e.target
        while (!elem.classList.contains("postItem")) {
            elem = elem.parentNode
            if (!elem.classList.contains("myPagePostList")) {
                break
            }
        }

        dispatch(updatePostId(elem.id))
        history.push({
            pathname: "/postread",
            state: { postId: elem.id },
        })
    }

    // 더보기
    const moreViewHandler = () => {
        history.push("/mypost")
    }

    return (
        <Outer>
            <GoBackButton />
            <ProfileArea>
                <ProfileImg src={userInfo.user_Photo} />
                <div className="mediaBox">
                    <p id="user-name">{userInfo.user_id}</p>
                    <p id="user-gender">
                        {userInfo.gender === 1 ? "남성" : "여성"}
                    </p>
                    <p id="user-location">나의 위치 : {userInfo.location}</p>
                    <p id="user-changeInfo" onClick={changeUserInfo}>
                        정보수정
                    </p>
                </div>
                <ButtonArea>
                    <button onClick={() => history.push("/editpassword")}>
                        비밀번호 수정
                    </button>
                    <button onClick={removeUserInfo}>회원탈퇴</button>
                    {isModalOpen === false ? null : (
                        <ModalConfirm
                            yesHandler={modalYesButtonHandlers}
                            noHandler={modalNoButtonHandler}
                            closeHandler={modalCloseButtonHandler}
                        >
                            <p>탈퇴하시겠습니까?</p>
                            <p>이유를 선택해 주세요</p>
                            <select name="pets" id="pet-select">
                                <option value="">선택</option>
                                <option value="notUseful">
                                    사용을 많이 하지 않음
                                </option>
                                <option value="inconvenientDesign">
                                    디자인이 불편함
                                </option>
                                <option value="otherOptions">
                                    다른 앱을 이용하기 위해
                                </option>
                                <option value="andSoForth">기타</option>
                            </select>
                        </ModalConfirm>
                    )}
                </ButtonArea>
            </ProfileArea>

            <GridArea className="myPagePostList">
                <div className="item more">
                    <p>내가 쓴 예보</p>
                </div>
                {currentPosts.map((el) => (
                    <div
                        className={["item", "postItem"]}
                        id={el.id}
                        onClick={postClickHandler}
                        key={el.id}
                    >
                        <img src={el.post_photo} alt="posts" />
                    </div>
                ))}
                <button className="moreView" onClick={moreViewHandler}>
                    더 보기
                </button>
            </GridArea>
        </Outer>
    )
}
