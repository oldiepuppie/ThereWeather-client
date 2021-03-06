import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import DaumPostcode from 'react-daum-postcode';
import { changeIsLogin, changeMapPage } from '../../actions/index';
import { isInput, isLongerThan } from '../../utilities/validation';
import Toggle from '../../components/common/Toggle';

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

  @media ${(props) => props.theme.viewport10} {
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

  const [idInput, setIdInput] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [idInputMessage, setIdInputMessage] = useState('???????????? ???????????????.');
  const [pwInputMessage, setPwInputMessage] = useState('??????????????? ???????????????.');

  const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com&response_type=token&redirect_uri=${url}/login&scope=https://www.googleapis.com/auth/userinfo.email`;
  const { isLogin } = useSelector((state) => state.itemReducer);
  const [socialLogined, setSocialLogined] = useState(false);
  const [inputSignUpData, setInputSignUpData] = useState({
    idInput: '',
    pwInput: '',
    nickNameInput: '',
  });
  const [inputVaildMessage, setInputVaildMessage] = useState({
    idInput: '???????????? ??????????????????.',
    pwInput: '??????????????? ??????????????????.',
    nickNameInput: '???????????? ??????????????????.',
  });

  useEffect(() => {
    dispatch(changeMapPage(false));
    const urlinfo = new URL(window.location.href);
    const hash = urlinfo.hash;

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
        alert('?????? ????????? ??????, ???????????????');
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
        if (res.data.verified_email) {
          axios({
            url: url + `/users/socialcheck?user_id=${res.data.email}`,
            method: 'get',
            headers: {
              accept: 'application/json',
            },
          }).then((res2) => {
            if (!res2.data) {
              alert('?????? ?????? ?????? ??????');
              setSocialLogined(true);
              setInputSignUpData({
                ...inputSignUpData,
                idInput: res.data.email,
              });
              setInputVaildMessage({
                ...inputVaildMessage,
                idInput: '',
              });
              setUploadedImg({
                fileName: 'default-user=s96-c',
                filePath: `https://lh3.googleusercontent.com/a/default-user=s96-c`,
              });
            } else {
              alert('?????? ?????? ?????? ???????????? ??????');
              setInputVaildMessage({
                ...inputVaildMessage,
                idInput: '',
              });
              socialAutoLogin(res.data.email);
            }
          });
        } else {
          alert('????????? ????????? ???????????? ??????');
        }
      });
    }
  }, [dispatch, history, inputSignUpData, inputVaildMessage]);

  const loginidOnChangeHanlder = (e) => {
    setIdInput((prevInput) => e.target.value);

    if (isInput(e.target.value)) {
      setIdInputMessage((prevText) => '???????????? ???????????????.');
    } else {
      setIdInputMessage((prevText) => '');
    }
  };

  const pwOnChangeHandler = (e) => {
    setPwInput((prevInput) => e.target.value);

    if (isInput(e.target.value)) {
      setPwInputMessage((prevText) => '??????????????? ???????????????.');
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
        alert('???????????????');
        history.push('/');
      });
  };

  function googleLoginButtonHandler() {
    if (isLogin) {
      alert('?????? ????????????????????????.');
    } else {
      window.location.assign(GOOGLE_LOGIN_URL);
    }
  }

  const [userRoadAddress, setRoadUserAddress] = useState('??? ??????????????? ??????????????????.');
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

  useEffect(() => {
    if (isLongerThan(4, inputSignUpData.idInput)) {
      setInputVaildMessage((prev) => {
        return { ...inputVaildMessage, idInput: '' };
      });
    } else {
      setInputVaildMessage((prev) => {
        return { ...inputVaildMessage, idInput: '?????? ???????????? ????????? ?????????.' };
      });
    }
  }, [inputSignUpData.idInput]);

  useEffect(() => {
    if (isLongerThan(2, inputSignUpData.nickNameInput)) {
      setInputVaildMessage((prev) => {
        return { ...inputVaildMessage, nickNameInput: '' };
      });
    } else {
      setInputVaildMessage((prev) => {
        return {
          ...inputVaildMessage,
          nickNameInput: '???????????? ????????? ?????? ?????????.',
        };
      });
    }
  }, [inputSignUpData.nickNameInput]);

  function handleComplete(complevent) {
    setRoadUserAddress(complevent.roadAddress);
  }

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
      alert('?????? ????????? ??????, ???????????????');
      history.push('/');
    });
  }

  function signupFunc(e) {
    if (
      inputVaildMessage.idInput ||
      inputVaildMessage.nickNameInput ||
      userRoadAddress === '??? ??????????????? ??????????????????.'
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
          alert('????????? ???????????????.');
        } else if (res.status === 212) {
          alert('????????? ???????????????.!');
        } else if (res.status === 210) {
          alert('???????????? ?????? ?????????.');
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
        alert('????????? ??????????????? ????????? ???????????????.');
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
          <h2>?????? ????????? ?????? ??????</h2>
          <div className='SignUp--center'>
            <StyledArticle className='id'>
              <InputAndTitle className='inputIdSection'>
                <h3>?????????</h3>
                <div>{inputSignUpData.idInput}</div>
              </InputAndTitle>
              <ValidationListBox className='idValidationList'>
                <li>{inputVaildMessage.idInput}</li>
              </ValidationListBox>
            </StyledArticle>
            <StyledArticle className='password'>
              <InputAndTitle className='inputPwSection'>
                <h3>?????????</h3>
                <InputText
                  type='text'
                  name='nickNameInput'
                  placeholder='?????????'
                  onChange={idOnChangeHanlder('nickNameInput')}
                />
              </InputAndTitle>
              <ValidationListBox className='pwValidationList'>
                <li>{inputVaildMessage.nickNameInput}</li>
              </ValidationListBox>
            </StyledArticle>
            <StyledArticle className='1'>
              <InputAndTitle2 className='2'>
                <h3>??????</h3>
                <Toggle />
              </InputAndTitle2>
            </StyledArticle>
            <StyledArticle className='password'>
              <InputAndTitle className='inputPwSection'>
                <h3>?????????</h3>
                <DaumPostcode onComplete={handleComplete} />
              </InputAndTitle>
              <ValidationListBox className='pwValidationList'>{userRoadAddress}</ValidationListBox>
            </StyledArticle>
            <StyledArticle className='password'>
              <InputAndTitle className='inputPwSection'>
                <h3>???????????????</h3>
                <Buttons2>
                  <PhotoUploadSection onSubmit={onSubmit} className='photoUploadSection'>
                    <PhotoBox>{uploadedImg ? <PhotoBox2 src={uploadedImg.filePath} /> : <div></div>}</PhotoBox>
                    <Button2 type='file' className='photoButton' onChange={addFile} />
                    <Button3 type='submit'>?????????</Button3>
                  </PhotoUploadSection>
                </Buttons2>
              </InputAndTitle>
            </StyledArticle>
          </div>
          <Buttons className='SignUp--buttons'>
            <Button onClick={signupFunc}>??????</Button>
          </Buttons>
        </Outer>
      ) : (
        <LoginOuter className='loginPageComponent'>
          <h2>?????????</h2>
          <div className='Login--center'>
            <LoginStyledArticle className='id'>
              <LoginInputAndTitle className='inputIdSection'>
                <h3>?????????</h3>
                <LoginInputText
                  type='text'
                  name='idInput'
                  placeholder='???????????? ???????????????'
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
                <h3>????????????</h3>
                <LoginInputText
                  type='password'
                  name='pwInput'
                  placeholder='??????????????? ???????????????'
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
            <LoginButton onClick={loginButtonHandler}>?????????</LoginButton>
            <LoginButton onClick={googleLoginButtonHandler} google>
              <FontAwesomeIcon icon={faGoogle} />
              <span>?????? ?????????</span>
            </LoginButton>
          </LoginButtons>
        </LoginOuter>
      )}
    </>
  );
}
