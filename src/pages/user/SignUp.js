import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Toggle from '../../components/common/Toggle';
import DaumPostcode from 'react-daum-postcode';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { changeMapPage } from '../../actions/index';
import { isNumberAndLatin, isAllTypesOverLengthSix, isInput, isLongerThan, isMatch } from '../../utilities/validation';

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
`;

const Button = styled.button`
  width: 50vw;
  min-width: 100px;
  max-width: 300px;
  margin: 0.5rem;
  padding: 0.8rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.google ? '#EA4335' : 'pink')};
  border-radius: 1rem;
  &:hover {
    background-color: #ff7f9f;
  }
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
  background-color: #fec0cb;
  border-radius: 1rem;

  &:hover {
    background-color: #ff7f9f;
  }
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
  border-radius: 1rem;
  background-color: #fec0cb;

  &:hover {
    background-color: #ff7f9f;
  }
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

export default function SignUp() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [inputSignUpData, setInputSignUpData] = useState({
    idInput: '',
    pwInput: '',
    nickNameInput: '',
    emailInput: '',
    emailVaildCode: '',
  });

  const [inputVaildMessage, setInputVaildMessage] = useState({
    idInput: '???????????? ???????????????.',
    pwInput: '??????????????? ???????????????.',
    nickNameInput: '???????????? ???????????????.',
    emailInput: '???????????? ???????????????.',
    emailVaildCode: '????????? ?????? ?????? ?????? ??? ???????????? ?????????.',
  });

  const [pwCheckInput, setPwCheckInput] = useState('');
  const [pwCheckInputMessage, setPwCheckInputMessage] = useState('??????????????? ???????????? ???????????????.');
  const [userRoadAddress, setRoadUserAddress] = useState('??? ??????????????? ???????????????.');
  const { genderToggle } = useSelector((state) => state.itemReducer);
  const [photo, setPhoto] = useState('');
  const [uploadedImg, setUploadedImg] = useState({
    fileName: 'blankProfile.png',
    filePath: `${url}/img/blankProfile.png`,
  });
  const [codeOn, setCodeOn] = useState(false);

  useEffect(() => {
    dispatch(changeMapPage(false));
  }, [dispatch]);

  const idOnChangeHanlder = (key) => (e) => {
    setInputSignUpData({
      ...inputSignUpData,
      [key]: e.target.value,
    });
  };

  const idOnChangeHanlder2 = (e) => {
    setPwCheckInput(e.target.value);
  };

  useEffect(() => {
    if (isNumberAndLatin(inputSignUpData.idInput) && isLongerThan(4, inputSignUpData.idInput)) {
      setInputVaildMessage({ ...inputVaildMessage, idInput: '' });
    } else {
      setInputVaildMessage({
        ...inputVaildMessage,
        idInput: '?????? ???????????? ????????? ?????????.',
      });
    }
  }, [inputSignUpData.idInput]);

  useEffect(() => {
    if (isAllTypesOverLengthSix(inputSignUpData.pwInput)) {
      setInputVaildMessage({ ...inputVaildMessage, pwInput: '' });
    } else {
      setInputVaildMessage({
        ...inputVaildMessage,
        pwInput: '?????? ???????????? ???????????? ?????????.',
      });
    }

    if (isMatch(inputSignUpData.pwInput, pwCheckInput) && isInput(pwCheckInput)) {
      setPwCheckInputMessage('??????????????? ???????????? ??????????????????.');
    } else if (isMatch(inputSignUpData.pwInput, pwCheckInput)) {
      setPwCheckInputMessage('');
    } else {
      setPwCheckInputMessage('??????????????? ?????? ?????? ????????????.');
    }
  }, [inputSignUpData.pwInput, pwCheckInput]);

  useEffect(() => {
    if (isLongerThan(2, inputSignUpData.nickNameInput)) {
      setInputVaildMessage({ ...inputVaildMessage, nickNameInput: '' });
    } else {
      setInputVaildMessage({
        ...inputVaildMessage,
        nickNameInput: '???????????? ????????? ?????? ?????????.',
      });
    }
  }, [inputSignUpData.nickNameInput]);

  useEffect(() => {
    if (isLongerThan(5, inputSignUpData.emailInput) && inputSignUpData.emailInput.indexOf('@') !== -1) {
      setInputVaildMessage({ ...inputVaildMessage, emailInput: '' });
    } else {
      setInputVaildMessage({
        ...inputVaildMessage,
        emailInput: '???????????? 5?????? ????????????, @??? ???????????????.',
      });
    }
  }, [inputSignUpData.emailInput]);

  useEffect(() => {
    if (isLongerThan(1, inputSignUpData.emailVaildCode)) {
      setInputVaildMessage({ ...inputVaildMessage, emailVaildCode: '' });
    } else {
      setInputVaildMessage({
        ...inputVaildMessage,
        emailVaildCode: '????????? ???????????????.',
      });
    }
  }, [inputSignUpData.emailVaildCode]);

  function handleComplete(complevent) {
    setRoadUserAddress(complevent.roadAddress);
  }

  function emailSend() {
    if (!inputVaildMessage.emailInput && !inputVaildMessage.idInput) {
      axios({
        url: url + '/users/auth',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          temporary_id: inputSignUpData.idInput,
          email: inputSignUpData.emailInput,
        },
        withCredentials: true,
      }).then((res) => {
        if (res.status === 200) {
          alert('??????????????? ?????????????????????');
        } else {
          alert('??????????????? ????????? ?????????????????????');
        }
      });
    } else {
      alert('?????????, ???????????? ???????????????');
    }
  }

  function codeSend() {
    axios({
      url: url + '/users/auth',
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        temporary_id: inputSignUpData.idInput,
        email: inputSignUpData.emailInput,
        code: inputSignUpData.emailVaildCode,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.data) {
        setCodeOn(res.data);
        alert('????????? ?????? ?????? ???????????????.');
      } else {
        alert('????????? ????????? ?????? ???????????????.');
      }
    });
  }

  function signupFunc(e) {
    if (
      inputVaildMessage.idInput ||
      inputVaildMessage.pwInput ||
      inputVaildMessage.nickNameInput ||
      pwCheckInputMessage ||
      userRoadAddress === '??? ??????????????? ??????????????????.' ||
      codeOn === false
    ) {
    } else {
      axios({
        url: url + '/users/signup',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
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
        if (res.status === 211) {
          alert('????????? ???????????????.');
        } else if (res.status === 212) {
          alert('????????? ???????????????.');
        } else if (res.status === 210) {
          alert('???????????? ?????? ?????????.');
          history.push('/login');
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
        'Content-Type': 'multipart/form-data',
        withCredentials: true,
      })
      .then((res) => {
        const { fileName } = res.data;
        setUploadedImg({ fileName, filePath: `${url}/img/${fileName}` });
        alert('????????? ??????????????? ????????? ???????????????!');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addFile = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <Outer className='SignUpPageComponent'>
      <h2>????????????</h2>
      <div className='SignUp--center'>
        <StyledArticle className='id'>
          <InputAndTitle className='inputIdSection'>
            <h3>?????????</h3>
            <InputText type='text' name='idInput' placeholder='?????????' onChange={idOnChangeHanlder('idInput')} />
          </InputAndTitle>
          <ValidationListBox className='idValidationList'>
            <li>{inputVaildMessage.idInput}</li>
          </ValidationListBox>
        </StyledArticle>
        <StyledArticle className='password'>
          <InputAndTitle className='inputPwSection'>
            <h3>????????????</h3>
            <InputText type='password' name='pwInput' placeholder='????????????' onChange={idOnChangeHanlder('pwInput')} />
          </InputAndTitle>
          <ValidationListBox className='pwValidationList'>
            <li>{inputVaildMessage.pwInput}</li>
          </ValidationListBox>
        </StyledArticle>
        <StyledArticle className='password'>
          <InputAndTitle className='inputPwSection'>
            <h3>???????????? ??????</h3>
            <InputText type='password' name='pwCheckInput' placeholder='???????????? ??????' onChange={idOnChangeHanlder2} />
          </InputAndTitle>
          <ValidationListBox className='pwValidationList'>
            <li>{pwCheckInputMessage}</li>
          </ValidationListBox>
        </StyledArticle>
        <StyledArticle className='password'>
          <InputAndTitle className='inputPwSection'>
            <h3>????????? ??????</h3>
            <InputText
              type='email'
              name='emailInput'
              placeholder='ex) example@exammail.com'
              onChange={idOnChangeHanlder('emailInput')}
            />
          </InputAndTitle>
          <ValidationListBox className='pwValidationList'>
            <li>{inputVaildMessage.emailInput}</li>
            <Buttons className='SignUp--buttons'>
              <Button onClick={emailSend}>???????????? ?????????</Button>
            </Buttons>
          </ValidationListBox>
        </StyledArticle>
        <StyledArticle className='password'>
          <InputAndTitle className='inputPwSection'>
            <h3>????????? ?????? ??????</h3>
            <InputText
              type='email'
              name='emailVaildCode'
              placeholder='????????????'
              onChange={idOnChangeHanlder('emailVaildCode')}
            />
          </InputAndTitle>
          <ValidationListBox className='pwValidationList'>
            <li>{inputVaildMessage.emailVaildCode}</li>
          </ValidationListBox>
          <Buttons className='SignUp--buttons'>
            <Button onClick={codeSend}>?????? ????????????</Button>
          </Buttons>
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
            <h3>??????</h3>
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
  );
}
