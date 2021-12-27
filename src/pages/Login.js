import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { changeIsLogin, changeMapPage } from '../actions/index';
import Toggle from '../components/common/Toggle';
import DaumPostcode from 'react-daum-postcode';

const LoginOuter = styled.section`
  position: relative;
  width: 100vw;
  min-height: calc(var(--mobile-page-height) - 70px);
  background-color: var(--page-bg-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin: 2rem auto;
  }

  @media screen and (min-width: 1081px) {
    height: calc(100vh - 125px);
  }
`;

const LoginStyledArticle = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoginInputAndTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;

  h3 {
    font-size: 1.4rem;
    margin: 1rem;
    font-weight: bold;
  }
`;

const LoginInputText = styled.input`
  min-width: 150px;
  width: 30vw;
  font-size: 1.2rem;
  padding: 0.5rem;
`;

const LoginValidationListBox = styled.ul`
  list-style: none;
  padding: 0 1.5rem;
  font-size: 1rem;

  li {
    height: 1.2rem;
    padding: 0 1.5rem;
    color: var(--font-validation-negative);
  }
`;

const LoginButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 3rem auto;
`;

const LoginButton = styled.button`
  width: 50vw;
  min-width: 100px;
  max-width: 300px;
  margin: 1rem;
  padding: 0.8rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
  background-color: pink;
  border-radius: 1rem;

  &:hover {
    background-color: #ff7f9f;
    color: white;
  }

  > span {
    margin: 0.25rem;
  }
`;

const Outer = styled.section`
  position: relative;
  width: 100vw;
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
`;

const StyledArticle = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InputAndTitle = styled.div`
  justify-content: flex-end;
  align-items: center;
  margin: 1rem;

  h3 {
    font-size: 1.4rem;
    margin: 1rem;
    font-weight: bold;
  }
`;

const InputAndTitle2 = styled.div`
  display: flex;
  flex-direction: row;
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
`;

const InputText = styled.input`
  min-width: 150px;
  width: 30vw;
  font-size: 1.2rem;
  padding: 0.5rem;
`;

const ValidationListBox = styled.ul`
  list-style: none;
  padding: 0 1.5rem;
  font-size: 1rem;

  li {
    height: 1.2rem;
    padding: 0 1.5rem;
    color: var(--font-validation-negative);
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 3rem auto;
`;

const Button = styled.button`
  width: 50vw;
  min-width: 100px;
  max-width: 300px;
  margin: 1rem;
  padding: 0.8rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #ea4335;
  border-radius: 1rem;

  > span {
    margin: 0.25rem;
  }
`;

const Buttons2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 3rem auto;
`;

const Button3 = styled.button`
  width: 50vw;
  min-width: 100px;
  max-width: 300px;
  margin: 1rem;
  padding: 0.8rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #2f6ecb;
  border-radius: 1rem;

  > span {
    margin: 0.25rem;
  }
`;

const Button2 = styled.input`
  width: 50vw;
  min-width: 100px;
  max-width: 300px;
  margin: 1rem;
  padding: 0.8rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.google ? '#EA4335' : '#2f6ecb')};
  border-radius: 1rem;

  > span {
    margin: 0.25rem;
  }
`;

const PhotoUploadSection = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const PhotoBox = styled.div`
  min-width: 300px;
  width: 30vh;
  height: 30vh;
  background-color: #ececec;
  font-size: 30px;
  color: palevioletred;
  border: 1px solid #b5b5b5;
  object-fit: cover;
`;
const PhotoBox2 = styled.img`
  min-width: 300px;
  width: 30vh;
  height: 30vh;
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  // input 상태 관리, 유효성 검사
  const [idInput, setIdInput] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [idInputMessage, setIdInputMessage] = useState('아이디를 입력하세요.');
  const [pwInputMessage, setPwInputMessage] = useState('비밀번호를 입력하세요.');

  const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=1079927639813-87e5g0991msheh50mt77eclt2vij4kks.apps.googleusercontent.com&response_type=token&redirect_uri=${url}/login&scope=https://www.googleapis.com/auth/userinfo.email`;
  const { isLogin } = useSelector((state) => state.itemReducer);
  const [socialLogined, setSocialLogined] = useState(false);
  const [inputSignUpData, setInputSignUpData] = useState({
    idInput: '',
    pwInput: '',
    nickNameInput: '',
  });
  const [inputVaildMessage, setInputVaildMessage] = useState({
    idInput: '아이디를 입력해주세요.',
    pwInput: '패스워드를 입력해주세요.',
    nickNameInput: '닉네임을 입력해주세요.',
  });

  useEffect(() => {
    dispatch(changeMapPage(false));
    const urlinfo = new URL(window.location.href);
    const hash = urlinfo.hash;

    //간편가입완료했거나, 예전에 간편가입완료했던 소셜로그인사용자는 자동으로 로그인이 진행되게 하는 함수-hoon
    function socialAutoLogin(id) {
      axios({
        url: url + '/sociallogin',
        method: 'post',
        data: {
          user_id: id,
        },
      }).then((res) => {
        localStorage.setItem('ATOKEN', JSON.stringify(res.data.data.accessToken));
        dispatch(changeIsLogin(true));
        alert('소셜 로그인 완료, 환영합니다');
        history.push('/');
      });
    }

    if (hash) {
      const accessToken = hash.split('=')[1].split('&')[0];
      axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + accessToken,
        method: 'get',
        headers: {
          authorization: `token ${accessToken}`,
          accept: 'application/json',
        },
      }).then((res) => {
        //구글에 정상 인증완료시-hoon
        if (res.data.verified_email) {
          //구글측의 정상인증 회원이지만, 우리사이트 간편가입 되어있는지 확인 요청 -hoon
          axios({
            url: url + `/users/socialcheck?user_id=${res.data.email}`,
            method: 'get',
            headers: {
              accept: 'application/json',
            },
          }).then((res2) => {
            // 소셜인증 되었으나 회원등록은 안된경우-hoon
            if (!res2.data) {
              alert('소셜 간편 가입 필요');
              setSocialLogined(true);
              setInputSignUpData({
                ...inputSignUpData,
                idInput: res.data.email,
              });
              setInputVaildMessage({
                ...inputVaildMessage,
                idInput: '',
              });
              //구글에서 준 프로필이미지를 우리사이트의 이미지로 기본값으로 사용
              //사용자가 새로 업로드도 가능함
              setUploadedImg({
                fileName: 'default-user=s96-c',
                filePath: `https://lh3.googleusercontent.com/a/default-user=s96-c`,
              });
            }
            //소셜인증 되었으며, 회원등록 된경우-hoon
            else {
              // dispatch(changeIsLogin(res.data.verified_email))
              alert('소셜 간편 가입 되어있는 회원');
              setInputVaildMessage({
                ...inputVaildMessage,
                idInput: '',
              });
              socialAutoLogin(res.data.email);
            }
          });
        }
        //구글 인증실패시 로그인 불가-hoon
        else {
          alert('구글에 인증된 사용자가 아님');
        }
      });
    }
  }, [dispatch, history, inputSignUpData, inputVaildMessage]);

  const loginidOnChangeHanlder = (e) => {
    setIdInput((prevInput) => e.target.value);

    if (e.target.value.length === 0) {
      setIdInputMessage((prevText) => '아이디를 입력하세요.');
    } else {
      setIdInputMessage((prevText) => '');
    }
  };

  const pwOnChangeHandler = (e) => {
    setPwInput((prevInput) => e.target.value);

    if (e.target.value.length === 0) {
      setPwInputMessage((prevText) => '비밀번호를 입력하세요.');
    } else {
      setPwInputMessage((prevText) => '');
    }
  };

  const loginButtonHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        url + '/login',

        { user_id: idInput, password: pwInput },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        localStorage.setItem('ATOKEN', JSON.stringify(res.data.data.accessToken));
        dispatch(changeIsLogin(true));
        alert('환영합니다');
        history.push('/');
      });
  };

  function googleLoginButtonHandler() {
    if (isLogin) {
      alert('이미 로그인상태입니다.');
    } else {
      window.location.assign(GOOGLE_LOGIN_URL);
    }
  }
  //////////////////socialLogined.page코드//////////////

  const [userRoadAddress, setRoadUserAddress] = useState('위 검색창에서 검색해주세요.');
  const { genderToggle } = useSelector((state) => state.itemReducer);
  const [photo, setPhoto] = useState('');
  const [uploadedImg, setUploadedImg] = useState({
    fileName: 'blankProfile.png',
    filePath: `${url}/img/blankProfile.png`,
  });

  const idOnChangeHanlder = (key) => (e) => {
    setInputSignUpData({
      ...inputSignUpData,
      [key]: e.target.value,
    });
  };

  //아이디길이가 4자이상인가
  function isMoreThan4Length(word) {
    return word.length >= 4;
  }

  //닉네임 길이 2글자 이상인가
  function nickIsMoreThan4Length(word) {
    return word.length >= 2;
  }

  useEffect(() => {
    //아이디 유효성검사
    if (isMoreThan4Length(inputSignUpData.idInput)) {
      setInputVaildMessage((prev) => {
        return { ...inputVaildMessage, idInput: '' };
      });
    } else {
      setInputVaildMessage((prev) => {
        return { ...inputVaildMessage, idInput: '사용 불가능한 아이디 입니다.' };
      });
    }
  }, [inputSignUpData.idInput, inputVaildMessage]);

  useEffect(() => {
    //닉네임 유효성검사
    if (nickIsMoreThan4Length(inputSignUpData.nickNameInput)) {
      setInputVaildMessage((prev) => {
        return { ...inputVaildMessage, nickNameInput: '' };
      });
    } else {
      setInputVaildMessage((prev) => {
        return {
          ...inputVaildMessage,
          nickNameInput: '닉네임은 두글자 이상 입니다.',
        };
      });
    }
  }, [inputSignUpData.nickNameInput, inputVaildMessage]);

  function handleComplete(complevent) {
    setRoadUserAddress(complevent.roadAddress);
  }

  //간편가입완료했거나, 예전에 간편가입완료했던 소셜로그인사용자는 자동으로 로그인이 진행되게 하는 함수-hoon
  function socialAutoLogin(id) {
    axios({
      url: url + '/sociallogin',
      method: 'post',
      data: {
        user_id: id,
      },
    }).then((res) => {
      localStorage.setItem('ATOKEN', JSON.stringify(res.data.data.accessToken));
      dispatch(changeIsLogin(true));
      alert('소셜 로그인 완료, 환영합니다');
      history.push('/');
    });
  }

  function signupFunc(e) {
    if (
      inputVaildMessage.idInput ||
      inputVaildMessage.nickNameInput ||
      userRoadAddress === '위 검색창에서 검색해주세요.'
    ) {
    } else {
      axios({
        url: url + '/users/signup',
        method: 'post',
        data: {
          user_id: inputSignUpData.idInput,
          nickName: inputSignUpData.nickNameInput,
          gender: genderToggle,
          location: userRoadAddress,
          user_photo: uploadedImg.filePath,
        },
      }).then((res) => {
        if (res.status === 211) {
          alert('아이디 중복입니다.');
        } else if (res.status === 212) {
          alert('닉네임 중복입니다.!');
        } else if (res.status === 210) {
          alert('회원가입 완료 입니다.');
          socialAutoLogin(inputSignUpData.idInput);
        }
      });
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('img', photo);
    axios
      .post(url + '/users/photo', formData, {
        'Content-Type': 'application/json',
        withCredentials: true,
      })
      .then((res) => {
        const { fileName } = res.data;
        setUploadedImg({ fileName, filePath: `${url}/img/${fileName}` });
        alert('사진을 성공적으로 업로드 하였습니다.');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addFile = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <>
      {socialLogined ? (
        <Outer className='SignUpPageComponent'>
          <h2>소셜 로그인 간편 가입</h2>
          <div className='SignUp--center'>
            <StyledArticle className='id'>
              <InputAndTitle className='inputIdSection'>
                <h3>아이디</h3>
                <div>{inputSignUpData.idInput}</div>
              </InputAndTitle>
              <ValidationListBox className='idValidationList'>
                <li>{inputVaildMessage.idInput}</li>
              </ValidationListBox>
            </StyledArticle>
            <StyledArticle className='password'>
              <InputAndTitle className='inputPwSection'>
                <h3>닉네임</h3>
                <InputText
                  type='text'
                  name='nickNameInput'
                  placeholder='닉네임'
                  onChange={idOnChangeHanlder('nickNameInput')}
                />
              </InputAndTitle>
              <ValidationListBox className='pwValidationList'>
                <li>{inputVaildMessage.nickNameInput}</li>
              </ValidationListBox>
            </StyledArticle>
            <StyledArticle className='1'>
              <InputAndTitle2 className='2'>
                <h3>성별</h3>
                <Toggle />
              </InputAndTitle2>
            </StyledArticle>
            <StyledArticle className='password'>
              <InputAndTitle className='inputPwSection'>
                <h3>사는곳</h3>
                <DaumPostcode onComplete={handleComplete} />
              </InputAndTitle>
              <ValidationListBox className='pwValidationList'>{userRoadAddress}</ValidationListBox>
            </StyledArticle>
            <StyledArticle className='password'>
              <InputAndTitle className='inputPwSection'>
                <h3>프로필사진</h3>
                <Buttons2>
                  <PhotoUploadSection onSubmit={onSubmit} className='photoUploadSection'>
                    <PhotoBox>{uploadedImg ? <PhotoBox2 src={uploadedImg.filePath} /> : <div></div>}</PhotoBox>
                    <Button2 type='file' className='photoButton' onChange={addFile} />
                    <Button3 type='submit'>업로드</Button3>
                  </PhotoUploadSection>
                </Buttons2>
              </InputAndTitle>
            </StyledArticle>
          </div>
          <Buttons className='SignUp--buttons'>
            <Button onClick={signupFunc}>가입</Button>
          </Buttons>
        </Outer>
      ) : (
        <LoginOuter className='loginPageComponent'>
          <h2>로그인</h2>
          <div className='Login--center'>
            <LoginStyledArticle className='id'>
              <LoginInputAndTitle className='inputIdSection'>
                <h3>아이디</h3>
                <LoginInputText
                  type='text'
                  name='idInput'
                  placeholder='아이디를 입력하세요'
                  value={idInput}
                  onChange={loginidOnChangeHanlder}
                />
              </LoginInputAndTitle>
              <LoginValidationListBox className='idValidationList'>
                <li>{idInputMessage}</li>
              </LoginValidationListBox>
            </LoginStyledArticle>

            <LoginStyledArticle className='password'>
              <LoginInputAndTitle className='inputPwSection'>
                <h3>비밀번호</h3>
                <LoginInputText
                  type='password'
                  name='pwInput'
                  placeholder='비밀번호를 입력하세요'
                  value={pwInput}
                  onChange={pwOnChangeHandler}
                />
              </LoginInputAndTitle>
              <LoginValidationListBox className='pwValidationList'>
                <li>{pwInputMessage}</li>
              </LoginValidationListBox>
            </LoginStyledArticle>
          </div>

          <LoginButtons className='login--Loginbuttons'>
            <LoginButton onClick={loginButtonHandler}>로그인</LoginButton>
            <LoginButton onClick={googleLoginButtonHandler} google>
              <FontAwesomeIcon icon={faGoogle} />
              <span>구글 로그인</span>
            </LoginButton>
          </LoginButtons>
        </LoginOuter>
      )}
    </>
  );
}
