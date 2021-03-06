import styled from 'styled-components';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { changeUserPw } from '../../actions/index';
import { isAllTypes, isInput, isLengthBelow } from '../../utilities/validation';

const Outer = styled.section`
  position: relative;
  width: 100vw;
  min-height: calc(100vh - 125px - 70px);
  background-color: var(--page-bg-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  @media ${(props) => props.theme.viewportMin10} {
    min-height: calc(100vh - 125px);
  }
`;

const StyledArticle = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InputAndTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 1.3rem;
    margin: 1rem;
    font-weight: bold;
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
  padding: 0 0 1rem 0;
  font-size: 1rem;
`;

const StyledLi = styled.li`
  height: 1.2rem;
  padding: 0.3rem 2rem;
  font-size: 0.9rem;
  color: ${(props) => (props.valid ? `var(--font-validation-positive)` : `var(--font-validation-negative)`)};
  font-weight: ${(props) => (props.valid ? `bold` : `null`)};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem auto;
`;

const Button = styled.button`
  width: 25vw;
  min-width: 50px;
  max-width: 200px;
  margin: 0.5rem 1rem;
  padding: 0.8rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  border-radius: 1rem;
  background-color: #fec0cb;

  &:hover {
    background-color: #ff7f9f;
  }
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function PasswordEdit() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [curPwdInputWarning, setCurPwdInputWarning] = useState('??????????????? ??????????????????.');
  const [newPwdInputWarning, setNewPwdInputWarning] = useState({
    isNoInput: '??????????????? ??????????????????.',
    isTooShort: '6??? ??????????????? ?????????.',
    isWrongType: '????????? ????????? ???????????? ?????????.',
  });
  const { isNoInput, isTooShort, isWrongType } = newPwdInputWarning;
  const [isValid, setIsValid] = useState('');

  const curInputHandler = (e) => {
    setCurPwd((prev) => e.target.value);
    if (isInput(e.target.value)) {
      setCurPwdInputWarning((prev) => '??????????????? ??????????????????.');
    } else {
      setCurPwdInputWarning((prev) => '');
    }
  };

  const newInputHandler = (e) => {
    setNewPwd((prev) => e.target.value);

    if (isInput(e.target.value)) {
      setNewPwdInputWarning((prev) => {
        return { ...prev, isNoInput: '??????????????? ??????????????????.' };
      });
    } else {
      setNewPwdInputWarning((prev) => {
        return { ...prev, isNoInput: '' };
      });
    }

    if (isAllTypes(e.target.value)) {
      setNewPwdInputWarning((prev) => {
        return { ...prev, isWrongType: '??????, ??????, ??????????????? ?????? ??????????????? ?????????.' };
      });
      setIsValid((prev) => '');
    } else {
      setNewPwdInputWarning((prev) => {
        return { ...prev, isWrongType: '' };
      });
      setIsValid((prev) => '?????? ???????????????.');
    }

    if (isLengthBelow(6, e.target.value)) {
      setNewPwdInputWarning((prev) => {
        return { ...prev, isTooShort: '6??? ??????????????? ?????????.' };
      });
    } else {
      setNewPwdInputWarning((prev) => {
        return { ...prev, isTooShort: '' };
      });
    }
  };

  const editButtonHandler = (e) => {
    const token = JSON.parse(localStorage.getItem('ATOKEN'));
    axios({
      url: url + '/password',
      method: 'put',
      data: { password: newPwd },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
      withCredentials: true,
    }).then((res) => {
      dispatch(changeUserPw(true));
      history.push('/mypage');
    });
  };

  const cancelButtonHandler = (e) => {
    setCurPwd((prev) => '');
    setNewPwd((prev) => '');
    setIsValid((prev) => '');

    history.push('/home');
  };

  return (
    <Outer className='loginPageComponent'>
      <h2>???????????? ??????</h2>

      <div className='Login--center'>
        <StyledArticle className='id'>
          <InputAndTitle className='inputCurPwdSection'>
            <h3>?????? ????????????</h3>
            <InputText
              type='password'
              name='curPwd'
              placeholder='?????? ??????????????? ???????????????'
              onChange={curInputHandler}
              value={curPwd}
            />
          </InputAndTitle>
          <ValidationListBox className='idValidationList'>
            <StyledLi>{curPwdInputWarning}</StyledLi>
          </ValidationListBox>
        </StyledArticle>

        <StyledArticle className='password'>
          <InputAndTitle className='inputNewPwSection'>
            <h3>??? ????????????</h3>
            <InputText
              type='password'
              name='newPwd'
              placeholder='??????????????? ???????????????'
              onChange={newInputHandler}
              value={newPwd}
            />
          </InputAndTitle>
          <ValidationListBox className='pwValidationList'>
            <StyledLi valid>{isValid}</StyledLi>
            <StyledLi>{isNoInput}</StyledLi>
            <StyledLi>{isTooShort}</StyledLi>
            <StyledLi>{isWrongType}</StyledLi>
          </ValidationListBox>
        </StyledArticle>
      </div>

      <Buttons className='login--buttons'>
        <div>
          <Button onClick={editButtonHandler} edit>
            ??????
          </Button>
          <Button onClick={cancelButtonHandler}>??????</Button>
        </div>
      </Buttons>
    </Outer>
  );
}
