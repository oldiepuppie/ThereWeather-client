// 로그인 상태에서 뜨는 화면
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { changeIsLogin } from '../actions/index';

const Outer = styled.div`
  margin: 0 auto;
  background-color: var(--page-bg-color);
  width: 100vw;
  height: var(--desktop-page-height);
  display: flex;
  align-items: center;

  @media screen and (max-width: 1081px) {
    height: calc(100vh - 125px - 70px);
  }
`;

const InfoBoxes = styled.div`
  margin: 0 auto;
`;

const InfoBox = styled.div`
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 10px;
  width: 30vw;
  height: 10vh;
  text-align: center;
  border: 1px solid #dbdbdb;

  p {
    font-size: 1.5rem;
    color: black;
    margin: 0;
    line-height: 10vh;
    @media screen and (max-width: 375px) {
      font-size: 1rem;
    }
  }

  &:nth-child(n + 2) {
    margin-top: 3vh;
  }

  &:hover {
    border: 1px solid #fec0cb;
    p {
      color: #fec0cb;
    }
  }
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function UserInfo() {
  const dispatch = useDispatch();
  const history = useHistory();

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
    <Outer>
      <InfoBoxes>
        <InfoBox onClick={() => history.push('/mypage')}>
          <p>마이페이지</p>
        </InfoBox>
        <InfoBox>
          <button onClick={logoutBtnHandler}>
            <p>로그아웃</p>
          </button>
        </InfoBox>
      </InfoBoxes>
    </Outer>
  );
}
