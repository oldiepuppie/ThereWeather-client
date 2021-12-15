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
import { changeCurRoom } from "../actions/index"

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

let url = process.env.REACT_APP_LOCAL_URL
if (!url) url = "https://thereweather.space"
const socket = io.connect(url)

export default function Messenger() {
    const dispatch = useDispatch()
    const [prevmsg, setprevmsg] = useState([])
    const { userInfo } = useSelector((state) => state.itemReducer)
    //새로 추가할 메시지 한줄에 대한 이벤트 타겟(onChange용)-hoon
    const [msgevent, setmsgevent] = useState("")
    //메시지의 총 집합-hoon
    const [newMsgSection, setNewMsgSection] = useState([])
    //방을 새로 개설할때 쓰인다-hoon
    const [receiver_id, setreceiver_id] = useState("")
    const [curRoom, setcurRoom] = useState("") //현재접속중인방-hoon
    //이 회원이 채팅을 나누고 있는 다양한 채팅방 리스트-hoon
    const [joinedRoom, setjoinedRoom] = useState([""])
    const [roomInOut, setRoomInOut] = useState(false)

    const [recievemessage, setrecievemessage] = useState([])
    const history = useHistory()
    console.log(recievemessage)
    //새로 방을 개설할때 , 채팅할 상대의 아이디를 쓰는 이벤트타겟(onChange용)-hoon
    function roomNamefunc(e) {
        console.log(e.target.value)
        setreceiver_id(e.target.value)
    }
    //방을 개설할때 클릭된 함수
    function roomNameSubmit() {
        //방이름을 통일하기 위해 sort로 문자 정렬을 해준다.-hoon
        const user_id_sort = [userInfo.user_id, receiver_id].sort()
        // socket.emit("enter_room", `${user_id_sort[0]}_${user_id_sort[1]}`)
        // setcurRoom(`${user_id_sort[0]}_${user_id_sort[1]}`)

        //룸네임이 만들어지면 axios로 접속된 목록을 추가하여 데이터 베이스에 저장해주자-hoon
        axios({
            url: url + "/chat/rooms",
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                user_id: userInfo.user_id,
                receiver_id: receiver_id,
                roomName: `${user_id_sort[0]}_${user_id_sort[1]}`,
            },
            withCredentials: true,
        }).then((res) => {
            const joinRoom = new Set(res.data)
            setjoinedRoom([...joinRoom])
        })
    }
    //처음에 가지고 있는 참여된 방이 있는지 조회-hoon
    useEffect(() => {
        axios({
            url: url + `/chat/rooms?user_id=${userInfo.user_id}`,
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }).then((res) => {
            const joinRoom = new Set(res.data)
            setjoinedRoom([...joinRoom])
        })
    }, [])
    

    useState(() => {
        setNewMsgSection([...newMsgSection])
        setprevmsg([...prevmsg])
        console.log(newMsgSection)
    }, [roomInOut, prevmsg, newMsgSection])

    //방을 클릭했을때 방을 입장하게 할 함수-hoon
    function roomListClick(clickRoomName) {
        console.log(clickRoomName)
        // setcurRoom(clickRoomName)
        dispatch(changeCurRoom(clickRoomName))

        history.push("/chatroom")

        // setRoomInOut(true)

        // //현재 방입장-hoon
        // // socket.emit("enter_room", clickRoomName)
        // //방입장시 렌더링 할 메시지를 가져와야한다.
        // axios({
        //     url: url + `/chat/messagelist`,
        //     method: "post",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     data: {
        //         user_id: userInfo.user_id,
        //         receiver_id: curRoom
        //             .replace("_", "")
        //             .replace(`${userInfo.user_id}`, ""),
        //         roomName: curRoom,
        //     },
        //     withCredentials: true,
        // }).then((res) => {
        //     setprevmsg(res.data)
        // })
    }
    // useEffect(() => {
    //     console.log(curRoom)
    // }, [curRoom])
    //채팅방 메시지 글작성 이벤트타겟용 함수
   
    //채팅방 메시지 글 보내기 함수
    function msgSubmit() {
        axios({
            url: url + `/chat/messagelist`,
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                user_id: userInfo.user_id,
                receiver_id: curRoom
                    .replace("_", "")
                    .replace(`${userInfo.user_id}`, ""),
                roomName: curRoom,
                chatcontent: msgevent,
            },
            withCredentials: true,
        }).then((res) =>
            socket.emit("message", {
                user_id: userInfo.user_id,
                receiver_id: curRoom
                    .replace("_", "")
                    .replace(`${userInfo.user_id}`, ""),
                chatcontent: msgevent,
            })
        )
        setmsgevent("")
    }

    // socket.on("newMsg", (msg2) => {
    //     // console.log("메시지 적용되야됨")
    //     //총 메시지리스트를 여기서 업데이트하고있다
    //     setprevmsg([...msg, msg2])
    // })
    // useEffect(() => {
    //     axios({
    //         url: url + "/chat/messagelist",
    //         method: "post",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         data: {
    //             roomName: curRoom,
    //             chatcontent: JSON.stringify(msg),
    //         },
    //         withCredentials: true,
    //     }).then((res) => {})
    //     // .then((res) => console.log("글 업데이트 완료"))
    // }, [msg])

    const goBackHandler = () => {
        setRoomInOut(false)
    }

    return (
        <Container className="mapcontainer">
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
                            {el
                                .replace("_", "")
                                .replace(`${userInfo.user_id}`, "")}
                        </FriendListDiv>
                    ))}
                </RoomList>
            </RoomChatDiv>
        </Container>
    )
}
