import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import MapBox from "../components/MapBox"
import { changeMapPage } from "../actions/index"

const Container = styled.div`
    background-color: var(--page-bg-color);
    width: 100%;

    position: relative;

    @media screen and (min-width: 1081px) {
        // max-width: 100%;
        width: 100%;
        position: relative;
    }
`

export default function Map() {
    const dispatch = useDispatch()

    // const { userInfo } = useSelector((state) => state.itemReducer)
    // dispatch(changeUser(axiosData))
    // {/* <Container2 src="/img/fhd.png" /> */}

    useEffect(() => {
        dispatch(changeMapPage(true))
    }, [])
    return (
        <Container className="mapcontainer">
            <MapBox></MapBox>
        </Container>
    )
}
