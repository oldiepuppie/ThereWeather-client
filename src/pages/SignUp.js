import { useState, useEffect } from "react"
import styled from "styled-components"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { Toggle } from "../components/Toggle"
import DaumPostcode from "react-daum-postcode"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { changeMapPage } from "../actions/index"

/*
  TODO
  [x] 여러개의 Input 상태 관리
  [] 유효성 검사
    - [x] ul, li 추가
    - [] 함수로 구현
      - [x] input이 없는 경우
      - [] 등록되지 않은 정보인 경우
        - [] 악시오스
        - [] 모달? alert? 페이지에 렌더링?
*/

const Outer = styled.section`
    position: relative;
    width: 100vw;
    // height: var(--mobile-page-height);
    background-color: var(--page-bg-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: scroll;

    h2 {
        margin-top: 3rem;
        text-align: center;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 2rem;
    }

    @media screen and (min-width: 1081px) {
        // height: calc(100vh - 125px);
    }
`

const StyledArticle = styled.article`
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const InputAndTitle = styled.div`
    // display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 1rem;

    h3 {
        font-size: 1.4rem;
        margin: 1rem;
        font-weight: bold;
    }
`
const InputAndTitle2 = styled.div`
    // border: 1px solid blue;

    display: flex;
    flex-direction: row;
    // margin-top: -7rem;
    // padding-top: -5rem;

    align-items: center;
    h3,
    div {
        font-size: 1.4rem;
        margin: 1rem;
        font-weight: bold;
        margin-right: -1rem;
    }
    h3 {
        margin-left: 2rem;
    }
`

const InputText = styled.input`
    min-width: 150px;
    width: 30vw;
    font-size: 1.2rem;
    padding: 0.5rem;
`

const ValidationListBox = styled.ul`
    list-style: none;
    padding: 0 1.5rem;
    font-size: 1rem;

    li {
        height: 1.2rem;
        padding: 0 1.5rem;
        color: var(--font-validation-negative);
    }
`

const Buttons = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // margin: 0.5rem auto;
`

const Button = styled.button`
    width: 50vw;
    min-width: 100px;
    max-width: 300px;
    margin: 0.5rem;
    padding: 0.8rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    background-color: ${(props) => (props.google ? "#EA4335" : "pink")};
    border-radius: 1rem;
    &:hover {
        background-color: #FF7F9F;
    }
    > span {
        margin: 0.25rem;
    }
`
const Buttons2 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 3rem auto;
`

const Button3 = styled.button`
    width: 50vw;
    min-width: 100px;
    max-width: 300px;
    margin: 1rem;
    padding: 0.8rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    /* background-color: ${(props) => (props.google ? "#EA4335" : "#2f6ecb")}; */
    background-color: #FEC0CB;
    border-radius: 1rem;
    &:hover {
        background-color: #FF7F9F;
    }
    > span {
        margin: 0.25rem;
    }
`

const Button2 = styled.input`
    width: 50vw;
    min-width: 100px;
    max-width: 300px;
    margin: 1rem;
    padding: 0.8rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    /* background-color: ${(props) => (props.google ? "#EA4335" : "#2f6ecb")}; */
    border-radius: 1rem;
    background-color: #FEC0CB;
    &:hover {
        background-color: #FF7F9F;
    }
    > span {
        margin: 0.25rem;
    }
`
////////////////////////
const PhotoUploadSection = styled.form`
    // border: 2px solid yellow;
    // margin: auto 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`

const PhotoBox = styled.div`
    min-width: 300px;
    width: 30vh;
    height: 30vh;
    background-color: #ececec;
    font-size: 30px;
    color: palevioletred;
    border: 1px solid #b5b5b5;
    /* width: 300px;
height: 150px; */
    object-fit: cover;
`
const PhotoBox2 = styled.img`
    min-width: 300px;
    width: 30vh;
    height: 30vh;
`
////////////////////////
let url = process.env.REACT_APP_LOCAL_URL
// const url = process.env.REACT_APP_LOCAL_URL || process.env.REACT_APP_URL

export default function SignUp() {
    const dispatch = useDispatch()
    // input 상태 관리, 유효성 검사
    if (!url) {
        url = "https://thereweather.space"
    }
    const [inputSignUpData, setInputSignUpData] = useState({
        idInput: "",
        pwInput: "",
        nickNameInput: "",
        emailInput: "",
        emailVaildCode: "",
    })
    const [inputVaildMessage, setInputVaildMessage] = useState({
        idInput: "아이디를 입력하세요.",
        pwInput: "패스워드를 입력하세요.",
        nickNameInput: "닉네임을 입력하세요.",
        emailInput: "이메일을 입력하세요.",
        emailVaildCode: "이메일 인증 코드 기입 후 인증하기 하세요.",
    })
    const [pwCheckInput, setPwCheckInput] = useState("")
    const [pwCheckInputMessage, setPwCheckInputMessage] =
        useState("패스워드를 다시한번 입력하세요.")
    const [userRoadAddress, setRoadUserAddress] =
        useState("위 검색창에서 검색하세요.")
    const { genderToggle } = useSelector((state) => state.itemReducer)
    const [photo, setPhoto] = useState("")
    const [uploadedImg, setUploadedImg] = useState({
        fileName: "blankProfile.png",
        filePath: `${url}/img/blankProfile.png`,
    })
    const [codeOn, setCodeOn] = useState(false)

    const history = useHistory()
    useEffect(() => {
        dispatch(changeMapPage(false))
    }, [])
    const idOnChangeHanlder = (key) => (e) => {
        setInputSignUpData({
            ...inputSignUpData,
            [key]: e.target.value,
        })
    }
    const idOnChangeHanlder2 = (e) => {
        setPwCheckInput(e.target.value)
    }

    //영어랑 숫자만 가능
    function onlyNumberAndEnglish(str) {
        return /^[A-Za-z][A-Za-z0-9]*$/.test(str)
    }
    // [유효성 검증 함수]: 최소 6자 이상하면서, 알파벳과 숫자 및 특수문자(@$!%*#?&) 는 하나 이상 포함
    function strongPassword(str) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
            str
        )
    }
    //아이디길이가 4자이상인가
    function isMoreThan4Length(word) {
        return word.length >= 4
    }
    //패스워드가 같은가
    function isMatch(pwd1, pwd2) {
        return pwd1 === pwd2
    }
    //닉네임 길이 2글자 이상인가
    function nickIsMoreThan4Length(word) {
        return word.length >= 2
    }

    useEffect(() => {
        //아이디 유효성검사
        if (
            onlyNumberAndEnglish(inputSignUpData.idInput) &&
            isMoreThan4Length(inputSignUpData.idInput)
        ) {
            setInputVaildMessage({ ...inputVaildMessage, idInput: "" })
        } else {
            setInputVaildMessage({
                ...inputVaildMessage,
                idInput: "사용 불가능한 아이디 입니다.",
            })
        }
    }, [inputSignUpData.idInput])

    useEffect(() => {
        //패스워드 유효성
        if (strongPassword(inputSignUpData.pwInput)) {
            console.log("여긴엘스문아닌곳")

            setInputVaildMessage({ ...inputVaildMessage, pwInput: "" })
        } else if (!strongPassword(inputSignUpData.pwInput)) {
            console.log("여긴엘스문인데")
            setInputVaildMessage({
                ...inputVaildMessage,
                pwInput: "사용 불가능한 패스워드 입니다.",
            })
        }
        //패스워드 학인 유효성
        if (
            isMatch(inputSignUpData.pwInput, pwCheckInput) &&
            pwCheckInput.length === 0
        ) {
            setPwCheckInputMessage("패스워드를 다시한번 입력해주세요.")
        } else if (isMatch(inputSignUpData.pwInput, pwCheckInput)) {
            setPwCheckInputMessage("")
        } else {
            setPwCheckInputMessage("비밀번호가 일치 하지 않습니다.")
        }
        console.log(inputSignUpData)
        console.log(inputVaildMessage)
    }, [inputSignUpData.pwInput, pwCheckInput])

    useEffect(() => {
        //닉네임 유효성검사
        if (nickIsMoreThan4Length(inputSignUpData.nickNameInput)) {
            setInputVaildMessage({ ...inputVaildMessage, nickNameInput: "" })
        } else {
            setInputVaildMessage({
                ...inputVaildMessage,
                nickNameInput: "닉네임은 두글자 이상 입니다.",
            })
        }
    }, [inputSignUpData.nickNameInput])
    useEffect(() => {
        //이메일 유효성검사
        if (
            inputSignUpData.emailInput.length >= 5 &&
            inputSignUpData.emailInput.indexOf("@") !== -1
        ) {
            setInputVaildMessage({ ...inputVaildMessage, emailInput: "" })
        } else {
            setInputVaildMessage({
                ...inputVaildMessage,
                emailInput: "이메일은 5글자 이상이며, @를 포함합니다.",
            })
        }
    }, [inputSignUpData.emailInput])
    useEffect(() => {
        //이메일인증 코드 유효성검사
        if (inputSignUpData.emailVaildCode.length >= 1) {
            setInputVaildMessage({ ...inputVaildMessage, emailVaildCode: "" })
        } else {
            setInputVaildMessage({
                ...inputVaildMessage,
                emailVaildCode: "코드를 기입하세요.",
            })
        }
    }, [inputSignUpData.emailVaildCode])

    function handleComplete(complevent) {
        setRoadUserAddress(complevent.roadAddress)
    }
    function emailSend() {
        console.log("email 보내기")
        if (!inputVaildMessage.emailInput && !inputVaildMessage.idInput) {
            console.log("정상수행가능")
            axios({
                url: url + "/users/auth",
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    temporary_id: inputSignUpData.idInput,
                    email: inputSignUpData.emailInput,
                },
                withCredentials: true,
            }).then((res) => {
                console.log(res)
                if (res.status === 200) {
                    alert("인증메일을 발송하였습니다")
                } else {
                    alert("인증메일을 발송에 실패하였습니다")
                }
            })
        } else {
            console.log("안되는곳")
            alert("아이디, 이메일을 기입하세요")
        }
    }
    function codeSend() {
        console.log("code 보내기")
        axios({
            url: url + "/users/auth",
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                temporary_id: inputSignUpData.idInput,
                email: inputSignUpData.emailInput,
                code: inputSignUpData.emailVaildCode,
            },
            withCredentials: true,
        }).then((res) => {
            if (res.data) {
                setCodeOn(res.data)
                alert("이메일 인증 완료 되었습니다.")
            } else {
                alert("이메일 인증에 실패 하였습니다.")
            }
        })
    }
    function signupFunc(e) {
        console.log("프론트 콘솔:회원가입 입장")
        if (
            inputVaildMessage.idInput ||
            inputVaildMessage.pwInput ||
            inputVaildMessage.nickNameInput ||
            pwCheckInputMessage ||
            userRoadAddress === "위 검색창에서 검색해주세요." ||
            codeOn === false
        ) {
            console.log("프론트:빈칸을 채워주세요")
        } else {
            console.log("프론트:빈칸 채우기 완료")
            axios({
                url: url + "/users/signup",
                // url: url + "/signup",
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "text/plain",
                },
                data: {
                    user_id: inputSignUpData.idInput,
                    password: inputSignUpData.pwInput,
                    nickName: inputSignUpData.nickNameInput,
                    gender: genderToggle,
                    location: userRoadAddress,
                    user_photo: uploadedImg.filePath,
                },
                withCredentials: true,
            }).then((res) => {
                console.log(res)
                if (res.status === 211) {
                    alert("아이디 중복입니다.")
                } else if (res.status === 212) {
                    alert("닉네임 중복입니다.")
                } else if (res.status === 210) {
                    alert("회원가입 완료 입니다.")
                    history.push("/login")
                }
            })
        }
    }
    ////////////////////////////////////////////////
    const onSubmit = (e) => {
        console.log(e)
        e.preventDefault()
        const formData = new FormData()
        formData.append("img", photo)
        console.log(formData)
        axios
            .post(url + "/users/photo", formData, {
                "Content-Type": "multipart/form-data",
                withCredentials: true,
            })
            .then((res) => {
                const { fileName } = res.data
                setUploadedImg({ fileName, filePath: `${url}/img/${fileName}` })
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
    ////////////////////////////////////////////////////

    return (
        <Outer className="SignUpPageComponent">
            <h2>회원가입</h2>
            <div className="SignUp--center">
                <StyledArticle className="id">
                    <InputAndTitle className="inputIdSection">
                        <h3>아이디</h3>
                        <InputText
                            type="text"
                            name="idInput"
                            placeholder="아이디"
                            onChange={idOnChangeHanlder("idInput")}
                        />
                    </InputAndTitle>
                    <ValidationListBox className="idValidationList">
                        <li>{inputVaildMessage.idInput}</li>
                    </ValidationListBox>
                </StyledArticle>
                <StyledArticle className="password">
                    <InputAndTitle className="inputPwSection">
                        <h3>비밀번호</h3>
                        <InputText
                            type="password"
                            name="pwInput"
                            placeholder="비밀번호"
                            onChange={idOnChangeHanlder("pwInput")}
                        />
                    </InputAndTitle>
                    <ValidationListBox className="pwValidationList">
                        <li>{inputVaildMessage.pwInput}</li>
                    </ValidationListBox>
                </StyledArticle>
                <StyledArticle className="password">
                    <InputAndTitle className="inputPwSection">
                        <h3>비밀번호 확인</h3>
                        <InputText
                            type="password"
                            name="pwCheckInput"
                            placeholder="비밀번호 확인"
                            onChange={idOnChangeHanlder2}
                        />
                    </InputAndTitle>
                    <ValidationListBox className="pwValidationList">
                        <li>{pwCheckInputMessage}</li>
                    </ValidationListBox>
                </StyledArticle>
                {/* //////////////////////////////////////////////////////// */}
                <StyledArticle className="password">
                    <InputAndTitle className="inputPwSection">
                        <h3>이메일 인증</h3>
                        <InputText
                            type="email"
                            name="emailInput"
                            placeholder="ex) example@exammail.com"
                            onChange={idOnChangeHanlder("emailInput")}
                        />
                    </InputAndTitle>
                    <ValidationListBox className="pwValidationList">
                        <li>{inputVaildMessage.emailInput}</li>
                        <Buttons className="SignUp--buttons">
                            <Button onClick={emailSend}>인증메일 보내기</Button>
                        </Buttons>
                    </ValidationListBox>
                </StyledArticle>
                <StyledArticle className="password">
                    <InputAndTitle className="inputPwSection">
                        <h3>이메일 인증 코드</h3>
                        <InputText
                            type="email"
                            name="emailVaildCode"
                            placeholder="인증코드"
                            onChange={idOnChangeHanlder("emailVaildCode")}
                        />
                    </InputAndTitle>
                    <ValidationListBox className="pwValidationList">
                        <li>{inputVaildMessage.emailVaildCode}</li>
                    </ValidationListBox>
                    <Buttons className="SignUp--buttons">
                        <Button onClick={codeSend}>코드 인증하기</Button>
                    </Buttons>
                </StyledArticle>
                {/* //////////////////////////////////////////////////////// */}
                <StyledArticle className="password">
                    <InputAndTitle className="inputPwSection">
                        <h3>닉네임</h3>
                        <InputText
                            type="text"
                            name="nickNameInput"
                            placeholder="닉네임"
                            onChange={idOnChangeHanlder("nickNameInput")}
                        />
                    </InputAndTitle>
                    <ValidationListBox className="pwValidationList">
                        <li>{inputVaildMessage.nickNameInput}</li>
                    </ValidationListBox>
                </StyledArticle>
                <StyledArticle className="1">
                    <InputAndTitle2 className="2">
                        <h3>성별</h3>
                        <Toggle />
                    </InputAndTitle2>
                </StyledArticle>
                <StyledArticle className="password">
                    <InputAndTitle className="inputPwSection">
                        <h3>사는곳</h3>
                        <DaumPostcode onComplete={handleComplete} />
                    </InputAndTitle>
                    <ValidationListBox className="pwValidationList">
                        {userRoadAddress}
                    </ValidationListBox>
                </StyledArticle>
                <StyledArticle className="password">
                    <InputAndTitle className="inputPwSection">
                        <h3>프로필사진</h3>
                        <Buttons2>
                            {/* /////////////////////////////// */}
                            <PhotoUploadSection
                                onSubmit={onSubmit}
                                className="photoUploadSection"
                            >
                                <PhotoBox>
                                    {uploadedImg ? (
                                        <PhotoBox2 src={uploadedImg.filePath} />
                                    ) : (
                                        <div></div>
                                    )}
                                </PhotoBox>
                                <Button2
                                    type="file"
                                    className="photoButton"
                                    onChange={addFile}
                                />
                                <Button3 type="submit">업로드</Button3>
                            </PhotoUploadSection>
                            {/* /////////////////////////////// */}
                        </Buttons2>
                    </InputAndTitle>
                </StyledArticle>
            </div>
            <Buttons className="SignUp--buttons">
                <Button onClick={signupFunc}>가입</Button>
            </Buttons>
        </Outer>
    )
}
