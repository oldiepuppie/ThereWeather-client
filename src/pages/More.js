// 로그아웃 상태에서 뜨는 화면
import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { changeMapPage } from "../actions/index"
import { useDispatch } from "react-redux"

const Outer = styled.div`
    margin: 0 auto;
    background-color: var(--page-bg-color);
    width: 100vw;
    height: calc(100vh - 125px);
    display: flex;
    align-items: center;

    @media screen and (max-width: 1081px) {
        height: calc(100vh - 125px - 70px);
    }
`

const InfoBoxes = styled.div`
    margin: 0 auto;
`

const InfoBox = styled.div`
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 10px;
    width: 30vw;
    height: 10vh;
    text-align: center;
    // border: 1px solid #dbdbdb;
    border: 1px solid black;

    p {
        font-size: 1.5rem;
        color: black;
        margin: 0;
        line-height: 10vh;
        @media screen and (max-width: 375px) {
            font-size: 1rem;
        }
    }
    &:nth-child(n + 2) {
        margin-top: 3vh;
    }
    &:hover {
        // border: 1px solid #262626;
        border: 1px solid pink;
        p {
            // color: #262626;
            color: pink;
        }
    }

    @media screen and (max-width: 1081px) {
        /* border: 1px solid green; */
    }
    @media screen and (max-width: 375px) {
    }
`

export default function More() {
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(() => {
        dispatch(changeMapPage(false))
    }, [])
    return (
        <Outer>
            <InfoBoxes>
                <InfoBox onClick={() => history.push("/signup")}>
                    <p>회원가입</p>
                </InfoBox>
                <InfoBox onClick={() => history.push("/login")}>
                    <p>로그인</p>
                </InfoBox>
            </InfoBoxes>
        </Outer>
    )
}
