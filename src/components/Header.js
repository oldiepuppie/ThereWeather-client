import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faSun,
    faCloud,
    faCloudRain,
    faPooStorm,
    faSnowflake,
    faSearch,
} from "@fortawesome/free-solid-svg-icons"
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import {
    changeIsLogin,
    changeSearchword,
    changeWeatherFilter,
} from "../actions/index"
import React, { useState, useEffect } from "react"
import DaumPostcode from "react-daum-postcode"

const HeaderOuter = styled.div`
    width: 100vw;
    height: 125px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 1rem;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 100;
    border-bottom: 0.5px solid #dbdbdb;

    h1 {
        font-weight: bold;
        font-size: 2.5rem;
        margin: 0;
        padding: 0;
    }

    @media screen and (min-width: 1081px) {
        width: 100vw;
        background-color: white;
        flex-direction: row;
        justify-content: space-around;
    }
    @media screen and (max-width: 375px) {
        /* border: 1px solid red;  // 확인용 */
    }
`

const Wing = styled.div`
    display: none;

    @media screen and (min-width: 1081px) {
        display: flex;
        flex-growth: 1;
        align-items: center;
        justify-content: center;
        width: 20vw;
    }
`

const TitleAndLogo = styled.div`
    display: ${(props) => (props.isMobileLogo ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    color: #231f20;

    & img {
        width: 20%;
        margin-right: 0.5rem;
    }

    @media screen and (min-width: 1081px) {
        display: flex;
        flex-growth: 1;
        align-items: center;
        justify-content: center;
        width: 20vw;
    }
`

const Center = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 350px;
    justify-content: space-around;

    @media screen and (min-width: 1081px) {
        flex-direction: row;
        flex-growth: 2;
        width: 60vw;
    }
`

const InputAndSubmit = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    div {
        margin: auto 1rem;
    }
    @media screen and (max-width: 1081px) {
        div {
            margin: 0;
        }
    }
`
// 주소검색창 부분
const StyledPostCode = styled(DaumPostcode)`
    position: absolute;
    top: 50px;
    border: 1px solid #e0e0e0;
    @media screen and (max-width: 1081px) {
        top: 32px;
    }
`

const Input = styled.input`
    padding: 0.5rem;
    font-size: 1.2rem;
    text-align: center;
    background-color: var(--page-bg-color);
    border: 0.5px solid #dbdbdb;
    border-radius: 3px;

    @media screen and (min-width: 1081px) {
        width: 300px;
    }
    @media screen and (max-width: 375px) {
        width: 220px;
        height: 30px;
        font-size: 1rem;
    }
`

const Buttons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    svg:hover {
        color: red;
    }

    @media screen and (max-width: 375px) {
        button {
            width: 35px;
            height: 35px;
            font-size: 20px;
        }
    }
`

const Button = styled.button`
    background-color: ${(props) =>
        props.bgGrey || props.isText ? "white" : "white"};
    color: ${(props) => (props.bgGrey || props.isText ? "#ff6384" : "grey")};
    font-size: ${(props) => (props.isText ? "1.6rem" : "1.6rem")};
    padding: ${(props) => (props.bgGrey ? ".6rem" : ".4rem")};
    margin: 0.5rem;
    border-radius: 10%;
`

const Button3 = styled.button`
    // width: 140px;
    // height: 45px;
    // font-size: 11px;
    font-size: ${(props) => (props.isText ? "1.6rem" : "1.6rem")};
  font-family: 'IBM Plex Sans KR', sans-serif;

    padding: ${(props) => (props.bgGrey ? ".6rem" : ".4rem")};
    margin: 0.5rem;
    border-radius: 10%;
    color: ${(props) => (props.bgGrey || props.isText ? "#ff6384" : "grey")};
    background-color: ${(props) =>
        props.bgGrey || props.isText ? "white" : "white"};
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-weight: 500;
    color: #000;
    background-color: #fff;
    // border:3px solid pink;
    // border: none;
    border-radius: 45px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;

    &:hover {
        background-color: pink;
        box-shadow: 0px 15px 20px #f7cac9;
        color: #fff;
    transform: translateY(-4px);

    @media screen and (max-width: 1081px) { // 임시 추가
        display: none;
    }
}
`
const Buttons3 = styled.button`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 1081px) { // 임시 추가
        display: none;
    }
`
// const SearchBarAndDaumPost = styled.div`
//     // display: flex;
//     // flex-direction: row;
//     position: relative;
//     margin: "100px solid green";
// `
// const DaumPostcodeWrap = styled.div`
//     height: 3.5rem;
//     width: 100%;
//     // padding-right: 2.5rem;
// `
const Cancel = styled.button`
    // height: 3.5rem;
    // width: 100%;
    // padding-right: 2.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    /* padding: 0.3rem; */
`

const Buttons2 = styled.div`
    background-color: ${(props) => (props.bgGrey ? "#E0E0E0" : "white")};
    color: ${(props) => (props.bgGrey || props.isText ? "black" : "grey")};
    font-size: ${(props) => (props.isText ? "1.2rem" : "1.6rem")};
    padding: ${(props) => (props.isText ? ".6rem" : ".4rem")};
    margin: 0.5rem;
    border-radius: 10%;
    @media screen and (max-width: 1081px) {
        padding: ${(props) => (props.isText ? ".6rem" : "0 0.5rem")};
    }
    @media screen and (max-width: 375px) {
        font-size: ${(props) => (props.isText ? "1.2rem" : "1.2rem")};
        padding: ${(props) => (props.isText ? ".6rem" : ".2rem")};
        height: 2rem;
    }
`

let url = process.env.REACT_APP_LOCAL_URL
if (!url) url = "https://thereweather.space"

export default function Header({ isInput, isMobileLogo, isText }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const { isLogin, mapPage } = useSelector((state) => state.itemReducer)
    console.log(mapPage)
    const [searchEvent, setSearchEvent] = useState("")
    //검색창에 사용할 포커스변수-hoon
    const [onFocus, setOnFocus] = useState(false)

    // const [postOnFocus, setOnFocus] = useState(false)

    // isInput : Map 페이지 사용시 true
    // isMobileLogo : Map 페이지 사용시 false
    function handleComplete(e) {
        console.log(e)
        setSearchEvent(e.roadAddress)
        setOnFocus(false)
    }
    const [weatherFilter, setweatherFilter] = useState("")
    useEffect(() => {
        setweatherFilter(weatherFilter)
        dispatch(changeWeatherFilter(weatherFilter))

        console.log(weatherFilter)
    }, [weatherFilter])

    const logoutBtnHandler = (e) => {
        const token = JSON.parse(localStorage.getItem("ATOKEN"))
        axios
            .post(
                url + "/signout",
                { data: null },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `token ${token}`,
                    },
                    withCredentials: true,
                }
            )
            .then((res) => {
                localStorage.clear()
                dispatch(changeIsLogin(false))
                history.push("/")
            })
    }

    return (
        <HeaderOuter className="header">
            <TitleAndLogo className="titleAndLogo" isMobileLogo={isMobileLogo}>
                <img
                    onClick={() => history.push("/")}

                    src="img/img6.png"

                    alt="logo"
                />
                <h2 onClick={() => history.push("/")}>There Weather</h2>
            </TitleAndLogo>

            {isInput ? (
                <Center className="headerCenter">
                    <InputAndSubmit className="inputAndSubmit">
                        <Input
                            // onClick={(e) => console.log(e)}
                            onChange={(e) => setSearchEvent(e.target.value)}
                            type="text"
                            placeholder="위치 검색"
                            value={searchEvent}
                            // ref={inputRef}
                            // onClick={onRest}
                            onFocus={(e) => setOnFocus(true)}
                        />
                        <Buttons2 bgGrey>
                            {onFocus ? (
                                <Cancel onClick={() => setOnFocus(false)}>
                                    Cancel
                                </Cancel>
                            ) : (
                                <FontAwesomeIcon
                                    onClick={() => {
                                        dispatch(changeSearchword(searchEvent))
                                        history.push("/map")
                                    }}
                                    icon={faSearch}
                                />
                            )}
                        </Buttons2>
                        {/* <SearchBarAndDaumPost> */}
                        {/* <DaumPostcodeWrap> */}

                        {/* </DaumPostcodeWrap> */}
                        {/* </SearchBarAndDaumPost> */}
                    </InputAndSubmit>
                    {onFocus ? (
                        <StyledPostCode
                            className="daumPostCodeContainer"
                            onComplete={handleComplete}
                        />
                    ) : (
                        <></>
                    )}
                    {mapPage.mapPage ? (
                        <Buttons className="headerButtons">
                            <Button
                                onClick={() => {
                                    if (weatherFilter === "sunny") {
                                        return setweatherFilter("")
                                    }
                                    return setweatherFilter("sunny")
                                }}
                                isText={
                                    weatherFilter === "sunny" ? true : false
                                }
                            >
                                <FontAwesomeIcon icon={faSun} />
                            </Button>
                            <Button
                                onClick={() => {
                                    if (weatherFilter === "cloudy") {
                                        return setweatherFilter("")
                                    }
                                    return setweatherFilter("cloudy")
                                }}
                                isText={
                                    weatherFilter === "cloudy" ? true : false
                                }
                            >
                                <FontAwesomeIcon icon={faCloud} />
                            </Button>
                            <Button
                                onClick={() => {
                                    if (weatherFilter === "rainy") {
                                        return setweatherFilter("")
                                    }
                                    return setweatherFilter("rainy")
                                }}
                                isText={
                                    weatherFilter === "rainy" ? true : false
                                }
                            >
                                <FontAwesomeIcon icon={faCloudRain} />
                            </Button>
                            <Button
                                onClick={() => {
                                    if (weatherFilter === "snowy") {
                                        return setweatherFilter("")
                                    }
                                    return setweatherFilter("snowy")
                                }}
                                isText={
                                    weatherFilter === "snowy" ? true : false
                                }
                            >
                                <FontAwesomeIcon icon={faSnowflake} />
                            </Button>
                        </Buttons>
                    ) : (
                        <div></div>
                    )}
                </Center>
            ) : (
                <Center className="headerCenter" />
            )}

            {isLogin ? (
                <Buttons3 className="loginAndSingupButtons">
                    {/* className="login" isText */}
                    <Button3
                        className="login"
                        onClick={logoutBtnHandler}
                        isText
                    >
                        logOut
                    </Button3>
                    <Button3
                        onClick={() => history.push("/mypage")}
                        className="signup"
                        isText
                    >
                        mypage
                    </Button3>
                </Buttons3>
            ) : (
                <Buttons3 className="loginAndSingupButtons">
                    <Button3
                        onClick={() => history.push("/login")}
                        className="login"
                        isText
                    >
                        logIn
                    </Button3>
                    <Button3
                        onClick={() => history.push("/signup")}
                        className="signup"
                        isText
                    >
                        signUp
                    </Button3>
                </Buttons3>
            )}
        </HeaderOuter>
    )
}
