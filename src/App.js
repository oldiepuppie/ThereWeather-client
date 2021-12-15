import React, { useEffect } from "react"
import { Switch, Route, Redirect, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import "./App.css"
import Map from "./pages/Map"
import Home from "./pages/Home"
import BookMark from "./pages/BookMark"
import Header from "./components/Header"
import MenuBar from "./components/MenuBar"
import UserInfo from "./pages/UserInfo"
import More from "./pages/More"
import MyPage from "./pages/MyPage"
import Login from "./pages/Login"
import PasswordEdit from "./pages/PasswordEdit"
import SignUp from "./pages/SignUp"
import MyPost from "./pages/MyPost"
import Write from "./pages/Write"
import PostRead from "./pages/PostRead"
import ReadBookMarkPost from "./pages/ReadBookMarkPost"
import PostEdit from "./pages/PostEdit"
import FirstPage from "./pages/FirstPage"
import Messenger from "./pages/Messenger"
import Messenger2 from "./pages/Messenger2"
import Loading from "./pages/Loading"
import EditUserInfo from "./pages/EditUserInfo"
import ChatRoom from "./pages/ChatRoom"

import { changeIsLogin, changeUser } from "./actions/index"

import styled from "styled-components"
import GlobalStyle from "./components/GlobalStyle"

let url = process.env.REACT_APP_LOCAL_URL

export default function App() {
    if (!url) {
        url = "https://thereweather.space"
    }
    const dispatch = useDispatch()
    const history = useHistory()

    const isInput = true
    const { isLogin } = useSelector((state) => state.itemReducer)
    useEffect(() => {
        console.log(JSON.parse(localStorage.getItem("ATOKEN")))
        //auth할차례
        if (localStorage.getItem("ATOKEN")) {
            axios({
                url: url + "/users/auth",
                method: "get",
                headers: {
                    authorization: `token ${JSON.parse(
                        localStorage.getItem("ATOKEN")
                    )}`,
                },
            }).then((res) => {
                console.log(res.data.data)
                dispatch(changeUser(res.data.data))
                dispatch(changeIsLogin(res.data.login))
            })
        }
    }, [isLogin])

    return (
        <>
            <GlobalStyle />
            <Header isInput={isInput} />
            <Switch>
                <Route exact path="/map">
                    <Map></Map>
                </Route>
                <Route exact path="/home">
                    <Home></Home>
                </Route>
                <Route exact path="/bookmark">
                    <BookMark></BookMark>
                </Route>
                <Route exact path="/userinfo">
                    <UserInfo></UserInfo>
                </Route>
                <Route exact path="/edituserinfo">
                    <EditUserInfo></EditUserInfo>
                </Route>
                <Route exact path="/more">
                    <More></More>
                </Route>
                <Route exact path="/mypage">
                    <MyPage></MyPage>
                </Route>
                <Route exact path="/login">
                    <Login></Login>
                </Route>
                <Route exact path="/signup">
                    <SignUp></SignUp>
                </Route>
                <Route exact path="/editpassword">
                    <PasswordEdit></PasswordEdit>
                </Route>
                <Route exact path="/write">
                    <Write></Write>
                </Route>
                <Route exact path="/mypost">
                    <MyPost></MyPost>
                </Route>
                <Route exact path="/postread">
                    <PostRead></PostRead>
                </Route>
                <Route exact path="/bookmarkpost">
                    <ReadBookMarkPost></ReadBookMarkPost>
                </Route>
                <Route exact path="/postedit">
                    <PostEdit></PostEdit>
                </Route>
                <Route exact path="/first">
                    <FirstPage />
                </Route>
                <Route exact path="/Messenger">
                    <Messenger />
                </Route>
                <Route exact path="/Messenger2">
                    <Messenger2 />
                </Route>
                <Route exact path="/loading">
                    <Loading />
                </Route>
                <Route exact path="/chatroom">
                    <ChatRoom />
                </Route>

                <Route exact path="/writeorlogin">
                    {isLogin ? (
                        <Redirect to="/write" />
                    ) : (
                        <Redirect to="/login" />
                    )}
                </Route>
                <Route exact path="/bookmarkorlogin">
                    {isLogin ? (
                        <Redirect to="/bookmark" />
                    ) : (
                        <Redirect to="/login" />
                    )}
                </Route>
                <Route exact path="/homeorlogin">
                    {isLogin ? (
                        <Redirect to="/home" />
                    ) : (
                        <Redirect to="/login" />
                    )}
                </Route>
                <Route exact path="/moreoruserinfo">
                    {isLogin ? (
                        <Redirect to="/userinfo" />
                    ) : (
                        <Redirect to="/more" />
                    )}
                </Route>
                <Route exact path="/editpost">
                    <PostEdit></PostEdit>
                </Route>
                <Route exact path="/">
                    <Redirect to="/first" />
                </Route>
            </Switch>
            <MenuBar></MenuBar>
        </>
    )
}
