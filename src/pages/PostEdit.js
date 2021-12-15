import React, { useState, useEffect } from "react"
import styled from "styled-components"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { changeMapPage } from "../actions/index"

/*
    [수정]
    이미지 태그에 alt 추가 (없으면 콘솔에 오류 뜸)
*/

const Outer = styled.div`
    overflow: scroll;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 100vw;
    min-height: var(--mobile-page-height);
    padding: 3rem auto;
    background-color: var(--page-bg-color);

    @media screen and (min-width: 1081px) {
        flex-direction: row;
        min-height: var(--desktop-page-height);
        padding: 2rem;
    }
`

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    border-radius: ${(props) => (props.round ? "50%" : null)};
    background-color: var(--button-bg-normal);
    font-size: 1.25rem;
    padding: ${(props) => (props.round ? ".5rem .5rem" : ".5rem 2rem")};
    margin: ${(props) => (props.round ? ".5rem" : "1rem")};

    & > img {
        height: 1.5rem;
        width: 1.5rem;
    }
`
const Button2 = styled.input`
    width: 50vw;
    min-width: 100px;
    max-width: 300px;
    margin: 1rem;
    padding: 0.8rem;
    border-radius: 1rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #FEC0CB;

    > span {
        margin: 0.25rem;
    }
`

const PictureSection = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1rem;
    height: inherit;

    @media screen and (min-width: 1081px) {
        justify-content: center;
        width: 40vw;
    }
`

const DesktopRight = styled.section`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media screen and (min-width: 1081px) {
        justify-content: space-around;
        width: 40vw;
    }
`

const ButtonsAndSelects = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1rem;
`

const FlexColumnCenter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1rem auto;

    & > p {
        margin: 0.5rem;
        font-weight: bold;
    }
`

const FilteringButtons = styled.article`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`

const FilteringBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid grey;
    border: ${(props) => (props.active ? "3px solid black" : "3px solid grey")};
    height: 2rem;
    width: 2rem;
    margin: 0.25rem;
    background-color: white;
    border-radius: 0.3rem;

    img {
        width: 1.5rem;
        height: 1.5rem;
    }
`

const TextSection = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 2rem auto;
    height: inherit;

    & > .submitButton {
        margin: 2rem auto;
    }
`

const SelectArea = styled.article`
    display: flex;
    justify-content: center;
    align-items: center;

    & > select {
        padding: 0.3rem;
        margin: auto 0.5rem;
    }
`

const WriteText = styled.textarea`
    width: 70vw;
    min-width: 250px;
    height: ${(props) => (props.small ? "3rem" : "20vh")};
    text-align: justify;
    vertical-align: center;
    line-height: 1.2rem;
    font-size: 1.2rem;
    margin: 2rem 1rem 4rem;
    padding: 1rem;

    @media screen and (min-width: 1081px) {
        width: ${(props) => (props.small ? "35vw" : "40vw")};
        max-width: ${(props) => (props.small ? "500px" : "800px")};
    }
`
const PhotoBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: auto;
    min-width: 300px;
    min-height: 300px;
    background-color: #ececec;
    border: 1px solid #b5b5b5;
    object-fit: cover;
`

const PhotoBox2 = styled.img`
    min-width: 300px;
    width: 30vh;
    height: auto;
`

const Button3 = styled.button`
    width: 50vw;
    min-width: 100px;
    max-width: 300px;
    margin: 0.5rem;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #FEC0CB;
    border-radius: 1rem;

    > span {
        margin: 0.25rem;
    }
`

const Secret = styled.div`
    color: white;
`


let url = process.env.REACT_APP_LOCAL_URL
if (!url) url = "https://thereweather.space"

export default function Write() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { userInfo, curLocation, postInfo, readPostId } = useSelector((state) => state.itemReducer)
    // console.log('userId : ',userInfo);
    // console.log('postInfo : ', postInfo);
    // console.log('readPostId : ', readPostId);
    const [postId, setPostId] = useState(readPostId)
    const [selectWeather, setSelectWeather] = useState()    // 날씨
    const [selectWind, setSelectWind] = useState()  // 바람
    const [selectTemp, setSelectTemp] = useState()  // 온도
    const [photo, setPhoto] = useState("")
    const [userPosts, setUserPosts] = useState()
    const [uploadedImg, setUploadedImg] = useState({
        fileName: "blankPost.png",
        filePath: `${url}/img/blankPost.png`,
    })
    const postIds = Number(readPostId)
    // console.log('postIds : ', postIds)

    // 제목 handler
    const [title, setTitle] = useState("")

    const titleInputHandler = (e) => {
        setTitle((prev) => e.target.value)
    }
    useEffect(() => {
        console.log(userInfo.user_id)
    }, [])

    // 날씨 버튼
    const weathers = [
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
        "breezy",
        "windy",
        "strong",
        "cold",
        "hot",
    ]
    // 날씨 필터링용 state
    const [clickedWeatherButtons, setClickedWeatherButtons] = useState([])
    // 스타일 적용 state
    const [isFilteringBtnActive, setIsFilteringBtnActive] = useState({
        sunny: false,
        cloudy: false,
        rainy: false,
        snowy: false,
    })
    const [isFilteringBtnActive2, setIsFilteringBtnActive2] = useState({
        breezy: false,
        windy: false,
        strong: false,
    })
    const [isFilteringBtnActive3, setIsFilteringBtnActive3] = useState({
        cold: false,
        hot: false,
    })

    // 날씨 버튼 handler
    const weatherBtnHandler = (e) => {
        if (e.target.nodeName === "ARTICLE") return
        let elem = e.target

        while (!elem.classList.contains("weatherButton")) {
            elem = elem.parentNode
            console.log("while - work?", elem.name)
            setSelectWeather(elem.name)

            if (elem.nodeName === "ARTICLE") {
                elem = null
                return
            }
        }

        if (elem && clickedWeatherButtons.includes(elem.name)) {
            setClickedWeatherButtons((arr) => [
                ...arr.filter((btnName) => btnName !== elem.name),
            ])
            setIsFilteringBtnActive((btnListObj) => {
                return { ...btnListObj, [elem.name]: false }
            })
        } else {
            setClickedWeatherButtons((arr) => [...arr, elem.name])
            setIsFilteringBtnActive((btnListObj) => {
                return { ...btnListObj, [elem.name]: true }
            })
        }
    }

    // 겉옷 더미데이터
    const outer = [
        ["default", "겉옷 선택"],
        ["가디건", "가디건"],
        ["자켓", "자켓"],
        ["얇은코트", "얇은 코트"],
        ["두꺼운코트", "두꺼운 코트"],
        ["패딩", "패딩"],
    ]

    // 상의 더미데이터 (state 변수가 필요하게 될까?)
    const clothesTop = [
        ["default", "상의 선택"],
        ["민소매", "민소매"],
        ["반팔", "반팔"],
        ["긴팔", "긴팔"],
        ["셔츠", "셔츠"],
        ["니트", "니트"],
    ]

    // 하의 더미데이터
    const clothesBottom = [
        ["default", "하의 선택"],
        ["반바지", "반바지"],
        ["긴바지", "긴 바지"],
    ]

    // select 상태 관리 & 이벤트 핸들러
    const [selectValueOuter, setSelectValueOuter] = useState("default")
    const [selectValueTop, setSelectValueTop] = useState("default")
    const [selectValueBottom, setSelectValueBottom] = useState("default")

    const selectOuterHandler = (e) => {
        setSelectValueOuter(e.target.value)
    }

    const selectTopHandler = (e) => {
        setSelectValueTop(e.target.value)
    }

    const selectBottomHandler = (e) => {
        setSelectValueBottom(e.target.value)
    }

    // textarea state & handler
    const [postText, setPostText] = useState("")
    const postTextHandler = (e) => {
        setPostText(e.target.value)
    }

    
    // 기존 데이터 렌더링
    useEffect(() => {
        axios({
            url: url + `/readpost?searchID=${userInfo.postIds}`,
            method: "get",
            params: {id : postIds},
            withCredentials: true,
        })
        .then((res) => {
            console.log('res : ', res.data);    // 해당 게시물 데이터 들어옴
            // 제목
            setTitle(res.data.post_title)
            // 사진
            setUploadedImg({ filePath: res.data.post_photo })
            // 날씨
            setIsFilteringBtnActive({ [res.data.weather]:true })
            setIsFilteringBtnActive2({ [res.data.wind]:true })
            setIsFilteringBtnActive3({ [res.data.temp]:true })

            // 코디
            setSelectValueOuter(res.data.outer_id)
            setSelectValueTop(res.data.top_id)
            setSelectValueBottom(res.data.bottom_id)
            // 내용
            setPostText(res.data.post_content)
        })
        .catch(err => console.log(err))
    }, [])


    // 등록버튼 이벤트
    const submitButtonHandler = (e) => {
        if (curLocation.lat === "") {
            alert("gps활용 허용하신 회원만 예보를 작성 할 수 있습니다.")
            history.push("/map")
        } else if (
            title.length > 0 &&
            postText.length > 0 &&
            uploadedImg.fileName !== "blankPost.png" &&
            // selectValueOuter !== "default" &&
            selectValueTop !== "default" &&
            selectValueBottom !== "default" &&
            selectWeather &&
            selectWind &&
            selectTemp &&
            curLocation
        ) {
            //&& !photo && !selectWeather && !selectWind && !setSelectTemp

            axios({
                url: url + "/editpost",
                method: "put",
                data: {
                    user_id: userInfo.user_id,
                    post_id: postId,
                    post_photo: uploadedImg.filePath,
                    post_title: title,
                    post_content: postText,
                    weather: selectWeather,
                    wind: selectWind,
                    temp: selectTemp,
                    outer_id: selectValueOuter,
                    top_id: selectValueTop,
                    bottom_id: selectValueBottom,
                    xLocation: curLocation.lat,
                    yLocation: curLocation.lon,
                },
                withCredentials: true,
            })
                .then((res) => {
                    alert("작성 완료")
                    history.push("/mypage")
                })
                .catch((err) => console.log(err))
        } else {
            alert("모든 항목은 필수입니다:)")
        }
    }
    useEffect(() => {
        dispatch(changeMapPage(false))
    }, [])
    useEffect(() => {
        setIsFilteringBtnActive({
            sunny: false,
            cloudy: false,
            rainy: false,
            snowy: false,
            [selectWeather]: true,
        })
    }, [selectWeather])
    useEffect(() => {
        setIsFilteringBtnActive2({
            breezy: false,
            windy: false,
            strong: false,
            [selectWind]: true,
        })
    }, [selectWind])
    useEffect(() => {
        setIsFilteringBtnActive3({
            cold: false,
            hot: false,
            [selectTemp]: true,
        })
    }, [selectTemp])
    function weatherFunc(select) {
        console.log("select=" + select)
        setSelectWeather(select)
    }
    function weatherFunc2(select) {
        console.log("select=" + select)
        setSelectWind(select)
    }
    function weatherFunc3(select) {
        console.log("select=" + select)
        setSelectTemp(select)
    }
    const onSubmit = (e) => {
        console.log(e)
        e.preventDefault()
        const formData = new FormData()
        formData.append("img", photo)
        console.log(formData)
        axios
            .post(url + "/post/photo", formData, {
                "Content-Type": "application/json",
                withCredentials: true,
            })
            .then((res) => {
                const { fileName } = res.data
                setUploadedImg({
                    fileName,
                    filePath: `${url}/img/${fileName}`,
                })
                alert("사진을 성공적으로 업로드 하였습니다!")
            })
            .catch((err) => {
                console.error(err)
            })
    }
    const addFile = (e) => {
        console.log(e.target.files[0])
        setPhoto(e.target.files[0])
    }
    function sFunc() {
        function random(min, max) {
            return parseFloat((Math.random() * (max - min) + min).toFixed(7))
        }
        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min + 1)) + min
        }
        for (let n = 0; n < 20; n++) {
            axios({
                url: url + "/post/write",
                method: "post",
                data: {
                    user_id: Math.random().toString(36).substr(2, 5),
                    post_photo: `http://placeimg.com/640/${getRandomIntInclusive(
                        480,
                        640
                    )}/nature`,
                    post_title: Math.random().toString(36).substr(2, 20),
                    post_content: Math.random().toString(36).substr(2, 100),
                    weather: ["sunny", "cloudy", "rainy", "snowy"][
                        getRandomIntInclusive(0, 3)
                    ],
                    wind: ["breezy", "windy", "strong"][
                        getRandomIntInclusive(0, 2)
                    ],
                    temp: ["cold", "hot"][getRandomIntInclusive(0, 1)],
                    outer_id: [
                        "가디건",
                        "자켓",
                        "얇은코트",
                        "두꺼운코트",
                        "패딩",
                    ][getRandomIntInclusive(0, 4)],
                    top_id: ["민소매", "반팔", "긴팔", "셔츠", "니트"][
                        getRandomIntInclusive(0, 4)
                    ],
                    bottom_id: ["반바지", "긴바지"][
                        getRandomIntInclusive(0, 1)
                    ],
                    xLocation: random(34.468469558695375, 38.215952021543174),
                    yLocation: random(126.25754765741554, 128.58236509939096),
                },
                withCredentials: true,
            })
        }
    }

    return (
        <Outer className="writePage">
            <PictureSection
                className="pictureUploadSection writePageLeft"
                onSubmit={onSubmit}
            >
                <article className="titleInput">
                    <WriteText
                        onChange={titleInputHandler}
                        value={title}
                        placeholder="제목을 입력하세요."
                        small
                    ></WriteText>
                </article>
                <PhotoBox>
                    {uploadedImg ? (
                        <PhotoBox2 src={uploadedImg.filePath} alt="icon" />
                    ) : (
                        <div></div>
                    )}
                </PhotoBox>
                <Button2
                    type="file"
                    className="uploadButton"
                    onChange={addFile}
                    round
                />
                <Button3 type="submit">업로드 </Button3>
            </PictureSection>

            <DesktopRight className="writePageRight">
                <ButtonsAndSelects className="buttonsAndSelects">
                    <FlexColumnCenter className="smallSection">
                        <p>날씨를 선택하세요.</p>
                        <FilteringButtons className="filteringButtons">
                            {/* {weathers.map((weather, idx) => { */}
                            {/* return ( */}
                            <FilteringBtn
                                name={"sunny"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive["sunny"]}
                                onClick={() => weatherFunc("sunny")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"sunny"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            <FilteringBtn
                                name={"cloudy"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive["cloudy"]}
                                onClick={() => weatherFunc("cloudy")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"cloudy"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            <FilteringBtn
                                name={"rainy"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive["rainy"]}
                                onClick={() => weatherFunc("rainy")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"rainy"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            <FilteringBtn
                                name={"snowy"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive["snowy"]}
                                onClick={() => weatherFunc("snowy")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"snowy"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            <FilteringBtn
                                name={"breezy"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive2["breezy"]}
                                onClick={() => weatherFunc2("breezy")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"breezy"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            <FilteringBtn
                                name={"windy"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive2["windy"]}
                                onClick={() => weatherFunc2("windy")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"windy"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            <FilteringBtn
                                name={"strong"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive2["strong"]}
                                onClick={() => weatherFunc2("strong")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"strong"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            <FilteringBtn
                                name={"hot"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive3["hot"]}
                                onClick={() => weatherFunc3("hot")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"hot"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            <FilteringBtn
                                name={"cold"}
                                className="weatherButton"
                                type="button"
                                active={isFilteringBtnActive3["cold"]}
                                onClick={() => weatherFunc3("cold")}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL
                                    }img/icons-write/${"cold"}.png`}
                                    alt="icon"
                                />
                            </FilteringBtn>
                            {/* ) */}
                            {/* })} */}
                        </FilteringButtons>
                    </FlexColumnCenter>

                    <FlexColumnCenter className="smallSection">
                        <p>의상을 선택하세요.</p>
                        <SelectArea>
                            <select
                                className="outer"
                                value={selectValueOuter}
                                onChange={selectOuterHandler}
                            >
                                {outer.map((elem, idx) => {
                                    return (
                                        <option value={elem[0]} key={idx}>
                                            {elem[1]}
                                        </option>
                                    )
                                })}
                            </select>
                            <select
                                className="top"
                                value={selectValueTop}
                                onChange={selectTopHandler}
                            >
                                {clothesTop.map((elem, idx) => {
                                    return (
                                        <option value={elem[0]} key={idx}>
                                            {elem[1]}
                                        </option>
                                    )
                                })}
                            </select>
                            <select
                                className="bottom"
                                value={selectValueBottom}
                                onChange={selectBottomHandler}
                            >
                                {clothesBottom.map((elem, idx) => {
                                    return (
                                        <option value={elem[0]} key={idx}>
                                            {elem[1]}
                                        </option>
                                    )
                                })}
                            </select>
                        </SelectArea>
                    </FlexColumnCenter>
                </ButtonsAndSelects>

                <TextSection>
                    <WriteText
                        type="text"
                        placeholder="글을 입력하세요."
                        value={postText}
                        onChange={postTextHandler}
                    />
                    <Button
                        className="submitButton"
                        onClick={submitButtonHandler}
                    >
                        등록
                    </Button>
                    <Secret onClick={() => sFunc()}>.</Secret>
                </TextSection>
            </DesktopRight>
        </Outer>
    )
}
