import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { changeIsLogin, changeSearchword, changeWeatherFilter } from '../../actions/index';
import React, { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';

const HeaderOuter = styled.div`
  width: 100vw;
  height: 125px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 1rem;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: 0.5px solid #dbdbdb;

  h1 {
    font-weight: bold;
    font-size: 2.5rem;
    margin: 0;
    padding: 0;
  }

  @media ${(props) => props.theme.viewportMin10} {
    width: 100vw;
    background-color: white;
    flex-direction: row;
    justify-content: space-around;
  }
`;

const TitleAndLogo = styled.div`
  display: ${(props) => (props.isMobileLogo ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  color: #231f20;

  & img {
    width: 20%;
    margin-right: 0.5rem;
  }

  @media ${(props) => props.theme.viewportMin10} {
    display: flex;
    flex-growth: 1;
    align-items: center;
    justify-content: center;
    width: 20vw;
  }
`;

const Center = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 350px;
  justify-content: space-around;

  @media ${(props) => props.theme.viewportMin10} {
    flex-direction: row;
    flex-growth: 2;
    width: 60vw;
  }
`;

const InputAndSubmit = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    margin: auto 1rem;
  }
  @media ${(props) => props.theme.viewportMax10} {
    div {
      margin: 0;
    }
  }
`;

const StyledPostCode = styled(DaumPostcode)`
  position: absolute;
  top: 50px;
  border: 1px solid #e0e0e0;
  @media ${(props) => props.theme.viewportMax10} {
    top: 32px;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1.2rem;
  text-align: center;
  background-color: var(--page-bg-color);
  border: 0.5px solid #dbdbdb;
  border-radius: 3px;

  @media ${(props) => props.theme.viewportMin10} {
    width: 300px;
  }
  @media ${(props) => props.theme.viewport3} {
    width: 220px;
    height: 30px;
    font-size: 1rem;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  svg:hover {
    color: red;
  }

  @media ${(props) => props.theme.viewport3} {
    button {
      width: 35px;
      height: 35px;
      font-size: 20px;
    }
  }
`;

const Button = styled.button`
  background-color: ${(props) => (props.bgGrey || props.isText ? 'white' : 'white')};
  color: ${(props) => (props.bgGrey || props.isText ? '#ff6384' : 'grey')};
  font-size: ${(props) => (props.isText ? '1.6rem' : '1.6rem')};
  padding: ${(props) => (props.bgGrey ? '.6rem' : '.4rem')};
  margin: 0.5rem;
  border-radius: 10%;
`;

const Button3 = styled.button`
  font-size: ${(props) => (props.isText ? '1.6rem' : '1.6rem')};
  padding: ${(props) => (props.bgGrey ? '.6rem' : '.4rem')};
  margin: 0.5rem;
  border-radius: 10%;
  color: ${(props) => (props.bgGrey || props.isText ? '#ff6384' : 'grey')};
  background-color: ${(props) => (props.bgGrey || props.isText ? 'white' : 'white')};
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: pink;
    box-shadow: 0px 15px 20px #f7cac9;
    color: #fff;
    transform: translateY(-4px);

    @media ${(props) => props.theme.viewportMax10} {
      display: none;
    }
  }
`;

const Buttons3 = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${(props) => props.theme.viewportMax10} {
    display: none;
  }
`;

const Cancel = styled.button`
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`;

const Buttons2 = styled.div`
  background-color: ${(props) => (props.bgGrey ? '#E0E0E0' : 'white')};
  color: ${(props) => (props.bgGrey || props.isText ? 'black' : 'grey')};
  font-size: ${(props) => (props.isText ? '1.2rem' : '1.6rem')};
  padding: ${(props) => (props.isText ? '.6rem' : '.4rem')};
  margin: 0.5rem;
  border-radius: 10%;

  @media ${(props) => props.theme.viewportMax10} {
    padding: ${(props) => (props.isText ? '.6rem' : '.4rem')};
  }

  @media ${(props) => props.theme.viewport3} {
    font-size: ${(props) => (props.isText ? '1.2rem' : '1.2rem')};
    padding: ${(props) => (props.isText ? '.6rem' : '.4rem')};
    height: 2rem;
  }
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function Header({ isInput, isMobileLogo }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLogin, mapPage } = useSelector((state) => state.itemReducer);
  const [searchEvent, setSearchEvent] = useState('');
  const [onFocus, setOnFocus] = useState(false);

  function handleComplete(e) {
    setSearchEvent(e.roadAddress);
    setOnFocus(false);
  }

  const [weatherFilter, setweatherFilter] = useState('');

  useEffect(() => {
    setweatherFilter(weatherFilter);
    dispatch(changeWeatherFilter(weatherFilter));
  }, [weatherFilter, dispatch]);

  const logoutBtnHandler = (e) => {
    const token = JSON.parse(localStorage.getItem('ATOKEN'));
    axios
      .post(
        url + '/signout',
        { data: null },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        localStorage.clear();
        dispatch(changeIsLogin(false));
        history.push('/');
      });
  };

  return (
    <HeaderOuter className='header'>
      <TitleAndLogo className='titleAndLogo' isMobileLogo={isMobileLogo}>
        <img onClick={() => history.push('/')} src='img/img6.png' alt='logo' />
        <h2 onClick={() => history.push('/')}>There Weather</h2>
      </TitleAndLogo>

      {isInput ? (
        <Center className='headerCenter'>
          <InputAndSubmit className='inputAndSubmit'>
            <Input
              onChange={(e) => setSearchEvent(e.target.value)}
              type='text'
              placeholder='?????? ??????'
              value={searchEvent}
              onFocus={(e) => setOnFocus(true)}
            />
            <Buttons2 bgGrey>
              {onFocus ? (
                <Cancel onClick={() => setOnFocus(false)}>Cancel</Cancel>
              ) : (
                <FontAwesomeIcon
                  onClick={() => {
                    dispatch(changeSearchword(searchEvent));
                    history.push('/map');
                  }}
                  icon={faSearch}
                />
              )}
            </Buttons2>
          </InputAndSubmit>
          {onFocus ? <StyledPostCode className='daumPostCodeContainer' onComplete={handleComplete} /> : <></>}
          {mapPage.mapPage ? (
            <Buttons className='headerButtons'>
              <Button onClick={() => (weatherFilter === 'sunny' ? '' : 'sunny')} isText={weatherFilter === 'sunny'}>
                <FontAwesomeIcon icon={faSun} />
              </Button>
              <Button onClick={() => (weatherFilter === 'cloudy' ? '' : 'cloudy')} isText={weatherFilter === 'cloudy'}>
                <FontAwesomeIcon icon={faCloud} />
              </Button>
              <Button onClick={() => (weatherFilter === 'rainy' ? '' : 'rainy')} isText={weatherFilter === 'rainy'}>
                <FontAwesomeIcon icon={faCloudRain} />
              </Button>
              <Button onClick={() => (weatherFilter === 'snowy' ? '' : 'snowy')} isText={weatherFilter === 'snowy'}>
                <FontAwesomeIcon icon={faSnowflake} />
              </Button>
            </Buttons>
          ) : (
            <div></div>
          )}
        </Center>
      ) : (
        <Center className='headerCenter' />
      )}

      {isLogin ? (
        <Buttons3 className='loginAndSingupButtons'>
          <Button3 className='login' onClick={logoutBtnHandler} isText>
            logOut
          </Button3>
          <Button3 onClick={() => history.push('/mypage')} className='signup' isText>
            mypage
          </Button3>
        </Buttons3>
      ) : (
        <Buttons3 className='loginAndSingupButtons'>
          <Button3 onClick={() => history.push('/login')} className='login' isText>
            logIn
          </Button3>
          <Button3 onClick={() => history.push('/signup')} className='signup' isText>
            signUp
          </Button3>
        </Buttons3>
      )}
    </HeaderOuter>
  );
}
