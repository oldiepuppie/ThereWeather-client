import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import MapBox from "../components/MapBox"
import Peer from "simple-peer"
import io from "socket.io-client"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPlusSquare,
    faChevronLeft,
    faPaperPlane,
} from "@fortawesome/free-solid-svg-icons"

const Container = styled.div`
    // 여기는 데스크탑
    margin: 0 auto;
    background-color: var(--page-bg-color);
    width: 100vw;
    height: var(--desktop-page-height);
    // display: flex;
    // align-items: center;

    @media screen and (max-width: 1081px) {
        // 여기가 모바일
        height: calc(100vh - 125px - 70px);
    }
`
const ProfileName = styled.div`
    // background-color: #f1319e;
    // width: 15%;
    font-size: 2rem;
    border: 1px solid pink;
    // position: relative;

    @media screen and (min-width: 1081px) {
        font-size: 2rem;
        // position: relative;
    }
`
const UserPhotoDiv = styled.div`
    // background-color: #f1319e;
    width: 15%;

    // border: 1px solid pink;
    // position: relative;

    @media screen and (min-width: 1081px) {
        // background-color: yellow;
        // max-width: 100%;
        width: 20%;
        // position: relative;
    }
`
const UserPhotoImg = styled.img`
    // background-color: #f1319e;
    width: 100%;
    // border: 1px solid pink;
    // position: relative;
    border-radius: 100%;

    @media screen and (min-width: 1081px) {
        // background-color: yellow;
        // max-width: 100%;
        // width: 100%;
        // position: relative;
    }
`
const RoomChatDiv = styled.div`
    // background-color: #f1319e;
    // width: 100%;
    border: 1px solid pink;
    height: 100%;

    // position: relative;
    // display: flex;

    @media screen and (min-width: 1081px) {
        // background-color: yellow;
        // max-width: 100%;
        border: 1px solid pink;
        height: 100%;
        // width: 100%;
        // position: relative;
    }
`
const RoomList = styled.div`
    // background-color: #f1319e;
    // width: 100%;
    // border: 2px solid pink;
    // position: relative;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    // align-content: center;
    // align-items: center;
    @media screen and (min-width: 1081px) {
        // background-color: yellow;
        // max-width: 100%;
        // border: 2px solid pink;

        // width: 100%;
        // position: relative;
    }
`
const ChatList = styled.div`
    // background-color: #f1319e;
    // width: 100%;
    // border: 2px solid pink;
    // position: relative;

    @media screen and (min-width: 1081px) {
        // background-color: yellow;
        // max-width: 100%;
        // border: 2px solid pink;

        // width: 100%;
        // position: relative;
    }
`
const Buttons = styled.button`
    display: flex;
    justify-content: center;
`

const Button = styled.button`
    color: ${(props) => (props.bgGrey || props.isText ? "black" : "grey")};
    font-size: ${(props) => (props.isText ? "1.2rem" : "1.6rem")};
    // padding: ${(props) => (props.isText ? ".6rem" : ".4rem")};
    // margin-top: 1rem;
    border-radius: 10%;
    // border: 1px solid black;
    // display: flex;
    // justify-content: center;
`
const FriendInput = styled.input`
    // margin-top: rem;
    // margin: 1px solid black;
    // padding: 0.5rem;
`
const FriendInputAndBtn = styled.div`
    // margin-top: rem;
    // margin: 1px solid black;
    // padding: 0.5rem;
    display: flex;
    // justify-content: between-around;
`
const FriendListDiv = styled.div`
    border-bottom: 1px solid black;
    margin-bottom: 1rem;
    margin-top: 1rem;
    // padding-bottom: 0.5rem;
    // vertical-align: center;
    // align-self: center;
`
const GoBackButton = styled.button`
    display: none;

    @media screen and (max-width: 1081px) {
        display: inline;
        /* top: 90vh; */
        // top: 1.5vh;
        // position: fixed;
        border-radius: 50%;
        z-index: 100;
        .fa-fw {
            font-size: 50px;
        }
    }
    @media screen and (max-width: 375px) {
        .fa-fw {
            font-size: 35px;
        }
    }
`

let url = process.env.REACT_APP_LOCAL_URL
if (!url) {
    url = "https://thereweather.space"
}
const socket = io.connect(url)

export default function Messenger2() {
    // const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.itemReducer)
    // dispatch(changeUser(axiosData))
    // {/* <Container2 src="/img/fhd.png" /> */}
    //방을 새로 개설할때 쓰인다
    const [roomName, setroomName] = useState("")
    const [curRoom, setcurRoom] = useState("") //현재접속중인방
    //메시지의 총 집합
    const [msg, setmsg] = useState([""])
    //새로 추가할 메시지 한줄에 대한 이벤트 타겟(onChange용)
    const [msgevent, setmsgevent] = useState("")
    //이 회원이 채팅을 나누고 있는 다양한 채팅방 리스트
    const [joinedRoom, setjoinedRoom] = useState([])
    const history = useHistory()
    const [roomInOut, setRoomInOut] = useState(false)

    //새로 방을 개설할때 , 채팅할 상대의 아이디를 쓰는 이벤트타겟(onChange용)
    function roomNamefunc(e) {
        console.log(e.target.value)
        setroomName(e.target.value)
    }
    //방을 개설할때 클릭된 함수
    function roomNameSubmit() {
        //방이름을 통일하기 위해 sort로 문자 정렬을 해준다.
        const user_id_sort = [userInfo.user_id, roomName].sort()
        socket.emit("enter_room", `${user_id_sort[0]}_${user_id_sort[1]}`)

        setcurRoom(`${user_id_sort[0]}_${user_id_sort[1]}`)
        //axios로 접속된 목록을 추가하여 데이터 베이스에 저장하는데, 유즈이펙트로, 변화가 있을때만 저장한다.
        axios({
            url: url + "/chat/rooms",
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                user_id: userInfo.user_id,
                opponent: roomName,
                roomlist: `${user_id_sort[0]}_${user_id_sort[1]}`,
            },
            withCredentials: true,
        }).then((res) => {
            console.log(res.data)
            setjoinedRoom(res.data)
        })
    }

    useEffect(() => {
        axios({
            url: url + `/chat/rooms?user_id=${userInfo.user_id}`,
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }).then((res) => setjoinedRoom(res.data))
    }, [])

    function roomListClick(clickRoomName) {
        setRoomInOut(true)
        socket.emit("enter_room", clickRoomName)
        setcurRoom(clickRoomName)

        axios({
            url: url + `/chat/messagelist?roomlist=${clickRoomName}`,
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }).then((res) => {
            setmsg(res.data)
        })
    }

    function msgfunc(e) {
        console.log(e.target.value)
        setmsgevent(e.target.value)
    }

    function msgSubmit() {
        socket.emit(
            "newMsg",
            `${userInfo.user_id} : ` + msgevent,
            curRoom,
            () => {
                // console.log("메시지추가 찍혀라")
                setmsg([...msg, `${userInfo.user_id} : ` + msgevent])
            }
        )
    }
    // socket.on("newMsg", setmsg([msg, ...msg]))

    // socket.on("welcome", () => {
    //     // console.log("메시지가 찍히나")
    //     // setmsg(["상대방이 방에 들어왔습니다", ...msg])
    // })
    // socket.on("bye", () => {
    //     // console.log("메시지가 찍히나")
    //     // setmsg(["상대방이 나갔습니다", ...msg])
    // })
    socket.on("newMsg", (msg2) => {
        // console.log("메시지 적용되야됨")
        //총 메시지리스트를 여기서 업데이트하고있다
        setmsg([...msg, msg2])
    })
    useEffect(() => {
        axios({
            url: url + "/chat/messagelist",
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                roomlist: curRoom,
                chatcontent: JSON.stringify(msg),
            },
            withCredentials: true,
        }).then((res) => {})
        // .then((res) => console.log("글 업데이트 완료"))
    }, [msg])

    const goBackHandler = () => {
        setRoomInOut(false)
    }
    return (
        <Container className="mapcontainer">
            {!roomInOut ? (
                <RoomChatDiv>
                    <ProfileName>{userInfo.user_id}</ProfileName>
                    <UserPhotoDiv>
                        <UserPhotoImg src={userInfo.user_Photo} />
                    </UserPhotoDiv>
                    <FriendInputAndBtn>
                        <FriendInput
                            onChange={(e) => roomNamefunc(e)}
                            placeholder="친구 ID"
                            required
                            type="text"
                        />
                        <Buttons>
                            <Button>
                                <FontAwesomeIcon
                                    onClick={roomNameSubmit}
                                    icon={faPlusSquare}
                                />
                            </Button>
                        </Buttons>
                    </FriendInputAndBtn>
                    <RoomList>
                        <FriendListDiv>{"개인 메시지"}</FriendListDiv>
                        {joinedRoom.map((el) => (
                            <FriendListDiv onClick={() => roomListClick(el)}>
                                {el.split("_").indexOf(userInfo.user_id) === 0
                                    ? el.split("_")[1]
                                    : el.split("_")[0]}
                            </FriendListDiv>
                        ))}
                    </RoomList>
                </RoomChatDiv>
            ) : (
                <>
                    <GoBackButton>
                        <FontAwesomeIcon
                            icon={faChevronLeft}
                            className="fa-fw"
                            color="#ACB5BD"
                            onClick={goBackHandler}
                        />
                    </GoBackButton>
                    <ChatList>
                        <div>{"채팅창"}</div>
                        {msg.map((el) => {
                            return <div>{el}</div>
                        })}
                    </ChatList>
                    <input
                        onChange={(e) => msgfunc(e)}
                        placeholder="메시지"
                        required
                        type="text"
                    />
                    <Buttons>
                        <Button>
                            <FontAwesomeIcon
                                onClick={msgSubmit}
                                icon={faPaperPlane}
                            />
                        </Button>
                    </Buttons>
                </>
            )}
        </Container>
    )
}
