// import { useState, useEffect } from "react";
import styled from "styled-components"
import One from "../components/FirstPage/One"
import Two from "../components/FirstPage/Two"
import Three from "../components/FirstPage/Three"
import Four from "../components/FirstPage/Four"
import { changeMapPage } from "../actions/index"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import Loading from "../pages/Loading"

const FirstPageContainer = styled.div`
    background: linear-gradient(#fff, #fef9ef, #fff5dc, #d7f9ff, #aaf2ff);
`

export default function FirstPage() {
    const dispatch = useDispatch()
    console.log(One)
    console.log(Two)
    console.log(Three)
    console.log(Four)

    // let assignedHeight = window.innerHeight * 0.95;
    // const [ locationY, setLocationY ] = useState(0);
    // console.log('[스크롤 위치]', Math.floor(locationY));
    // const scrollHandler = () => {
    //   setLocationY(window.pageYOffset);
    // }

    // useEffect(()=>{
    //   window.addEventListener('scroll', scrollHandler);
    //   return () => {
    //     window.removeEventListener('scroll', scrollHandler);
    //   }
    // }, []);
    useEffect(() => {
        dispatch(changeMapPage(false))
    }, [])

    return (
        <>
            {!One && !Two && !Three && !Four ? (
                <Loading></Loading>
            ) : (
                <FirstPageContainer className="firstPageWhole">
                    <One delayOne={"1s"} delayTwo={"1.2s"} />
                    <Two
                        delayOne={"2.2s"}
                        delayTwo={"2.5s"}
                        delayThree={"2.6s"}
                        delayFour={"2.7s"}
                        delayFive={"2.8s"}
                    />
                    <Three
                        delayOne={"4.0s"}
                        delayTwo={"4.3s"}
                        delayThree={"4.4s"}
                        delayFour={"4.5s"}
                        delayFive={"4.6s"}
                    />
                    <Four
                        delayOne={"5.5s"}
                        delayTwo={"5.8s"}
                        delayThree={"5.9s"}
                        delayFour={"6.0s"}
                        delayFive={"6.1s"}
                    />
                </FirstPageContainer>
            )}
        </>
    )
}
