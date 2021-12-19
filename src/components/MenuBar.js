import { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const Outer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100vw;
  z-index: 100;
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;

  @media screen and (min-width: 1081px) {
    width: 1080px;
  }
`;

const Buttons = styled.div`
  background-color: WHITE;
  height: 70px;
  right: 0;
  bottom: 0;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 101;
  border-top: 1px solid #dbdbdb;

  @media screen and (min-width: 1081px) {
    position: fixed;
    background-color: white;
    border-top: 1px solid #dbdbdb;
    border-left: 1px solid #dbdbdb;
    position: fiexd;
    width: 400px;
  }
`;

const Button1 = styled.button`
  padding: 0.5rem;
  margin: 0.5rem;
  font-size: 2rem;
  img:hover {
    filter: opacity(0.2) drop-shadow(0 0 0 red);
    background: url('img/home.png');
  }
`;

const Button2 = styled.button`
  padding: 0.5rem;
  margin: 0.5rem;
  font-size: 2rem;
  img:hover {
    filter: opacity(0.2) drop-shadow(0 0 0 red);
    background: url('img/like.png');
  }
`;

const Button3 = styled.button`
  padding: 0.5rem;
  margin: 0.5rem;
  font-size: 2rem;
  img:hover {
    filter: opacity(0.2) drop-shadow(0 0 0 red);
    background: url('img/location.png');
  }
`;

const Button4 = styled.button`
  padding: 0.5rem;
  margin: 0.5rem;
  font-size: 2rem;
  img:hover {
    filter: opacity(0.2) drop-shadow(0 0 0 red);
    background: url('img/pencil.png');
  }
`;

const Button5 = styled.button`
  padding: 0.5rem;
  margin: 0.5rem;
  font-size: 2rem;
  img:hover {
    filter: opacity(0.2) drop-shadow(0 0 0 red);
    background: url('img/setting.png');
  }
`;

export default function MenuBar() {
  const [url1] = useState('img/home0.png');
  const history = useHistory();

  return (
    <Outer className='menuBar'>
      <Buttons>
        <Button1 onClick={() => history.push('/homeorlogin')}>
          <img src={url1} alt='home button icon' />
        </Button1>
        <Button2 onClick={() => history.push('/bookmarkorlogin')}>
          <img src='https://img.icons8.com/ios/45/000000/like--v1.png' alt='bookmark button icon' />
        </Button2>
        <Button3>
          <img
            src='https://img.icons8.com/external-flatart-icons-outline-flatarticons/45/000000/external-location-map-location-flatart-icons-outline-flatarticons-13.png'
            onClick={() => history.push('/map')}
            alt='map button icon'
          />
        </Button3>
        <Button4 onClick={() => history.push('/writeorlogin')}>
          <img src='https://img.icons8.com/ios/45/000000/pencil--v1.png' alt='write button icon' />
        </Button4>
        <Button5 onClick={() => history.push('/moreoruserinfo')}>
          <img
            src='https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/45/000000/external-user-interface-kiranshastry-lineal-kiranshastry.png'
            alt='settings button icon'
          />
        </Button5>
      </Buttons>
    </Outer>
  );
}
