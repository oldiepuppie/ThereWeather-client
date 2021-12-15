import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { changeUser } from "../actions/index"
import LoadingSpinner from "../components/LoadingSpinner"

// 부모요소에 postion: relative 필요함
// props
// duration : 따옴표 안에 s(초) 단위로 지정
// ex) duration={'3s'}
// 지정하지 않은 경우 기본값 2s
// 숫자가 작을수록 빨리 돌아간다
// size : 따옴표 안에 px 단위로 지정
// ex) size={'30px'}
// 지정하지 않은 경우 기본값 (가로 === 세로)
// 모바일 50px
// 데스크탑 100px
// hide
// true -> display: none;
// false(지정하지 않은 경우 포함) -> display: flex;

const LoadingContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    display: ${(props) => (props.hide ? "none" : "flex")};
    justify-content: center;
    width: 100vw;
    min-height: 100vh;
    background-color: rgba(253, 254, 254, 0.5);
    // 밝은 회색, opacity 0.3
    z-index: 300;

    & > img {
        margin-top: calc(var(--mobile-header-height) + 10vh);

        @media screen and (min-width: 1081px) {
            margin-top: calc(var(--desktop-header-height) + 10vh);
        }
    }
`

export default function Loading({ size, duration, hide }) {
    // const dispatch = useDispatch()
    // const { userInfo } = useSelector((state) => state.itemReducer)
    // dispatch(changeUser(axiosData))

    return (
        <LoadingContainer className="loadingContainer" hide={hide}>
            <LoadingSpinner size={size} duration={duration} />
        </LoadingContainer>
    )
}
