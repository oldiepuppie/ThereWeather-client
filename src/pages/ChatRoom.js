import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPlusSquare,
    faChevronLeft,
    faPaperPlane,
} from "@fortawesome/free-solid-svg-icons"
import { useHistory } from "react-router-dom"
import axios from "axios"
import io from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { changeNewMsgSection } from "../actions/index"

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

const MeDiv = styled.div`
    // border-bottom: 1px solid green;
    // margin-bottom: 1rem;
    // margin-top: 1rem;
    // padding-bottom: 0.5rem;
    // vertical-align: center;
    // align-self: center;
    text-align: right;

    overflow: auto;
`
const YouDiv = styled.div`
    // border-bottom: 1px solid black;
    // margin-bottom: 1rem;
    // margin-top: 1rem;
    // padding-bottom: 0.5rem;
    // vertical-align: center;
    // align-self: center;
    text-align: left;

    overflow: auto;
`
let url = process.env.REACT_APP_LOCAL_URL
if (!url) url = "https://thereweather.space"
const socket = io.connect(url)

export default function ChatRoom() {
    const dispatch = useDispatch()

    const history = useHistory()
    const { userInfo, curRoom, newMsgSection } = useSelector(
        (state) => state.itemReducer
    )
    const [prevmsg, setprevmsg] = useState([])
    // const [newMsgSection, setNewMsgSection] = useState([])
    const [msgevent, setmsgevent] = useState("")

    console.log(curRoom)
    // useEffect(() => {
    //     setprevmsg([...prevmsg, newMsgSection])
    // }, [newMsgSection])

    // recievemessage = prevmsg
    // useEffect(() => {
    //     setprevmsg([...prevmsg])
    // }, [recievemessage])
    // let recievemessage = function (msgobj) {
    function recievemessage(msgobj) {
        // this.setState({
        //     messages:[...this.state.messages,messageobject]
        // })
        return dispatch(changeNewMsgSection([...newMsgSection, msgobj]))
    }
    /////////////메시지를 받았을때/////
    useEffect(() => {
        axios({
            url: url + `/chat/messagelist`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                user_id: userInfo.user_id,
                receiver_id: curRoom
                    .replace("_", "")
                    .replace(`${userInfo.user_id}`, ""),
                roomName: curRoom,
            },
            withCredentials: true,
        }).then((res) => {
            setprevmsg(res.data)
        })
        socket.on("sendmsg", (msgobj) =>
            // setNewMsgSection([...newMsgSection, msgobj])
            {
                console.log(newMsgSection)
                console.log(msgobj)
                // return dispatch(changeNewMsgSection([...newMsgSection, msgobj]))
                recievemessage({
                    user_id: msgobj.receiver_id,
                    receiver_id: msgobj.user_id,
                    chatcontent: msgobj.chatcontent,
                })
            }
        )
    }, [])

    useEffect(() => {
        axios({
            url: url + `/chat/messagelist`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                user_id: userInfo.user_id,
                receiver_id: curRoom
                    .replace("_", "")
                    .replace(`${userInfo.user_id}`, ""),
                roomName: curRoom,
            },
            withCredentials: true,
        }).then((res) => {
            setprevmsg(res.data)
        })
    }, [])
    function msgfunc(e) {
        console.log(e.target.value)
        setmsgevent(e.target.value)
    }

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
                // user_id: curRoom
                //     .replace("_", "")
                //     .replace(`${userInfo.user_id}`, ""),
                // receiver_id: userInfo.user_id,

                chatcontent: msgevent,
            })
        )
        setmsgevent("")
    }
    return (
        <Container className="mapcontainer">
            <GoBackButton>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="fa-fw"
                    color="#ACB5BD"
                    onClick={() => history.push("/messenger")}
                />
            </GoBackButton>
            <ChatList>
                <div>{"채팅창"}</div>
            </ChatList>
            {prevmsg.map((el) => {
                if (userInfo.user_id === el.user_id) {
                    return <MeDiv>{el.chatcontent}</MeDiv>
                } else {
                    return <YouDiv>{el.chatcontent}</YouDiv>
                }
            })}
            {newMsgSection.map((el) => {
                console.log(el)
                if (userInfo.user_id === el.user_id) {
                    return <MeDiv>{el.chatcontent}</MeDiv>
                } else {
                    return <YouDiv>{el.chatcontent}</YouDiv>
                }
            })}
            <input
                onChange={(e) => msgfunc(e)}
                placeholder="메시지"
                required
                type="text"
                value={msgevent}
            />
            <Buttons>
                <Button>
                    <FontAwesomeIcon onClick={msgSubmit} icon={faPaperPlane} />
                </Button>
            </Buttons>
        </Container>
    )
}
