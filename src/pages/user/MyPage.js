import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import ModalConfirm from '../../components/common/ModalConfirm';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { changeIsLogin, userPosts, updatePostId } from '../../actions/index';
import GoBackButton from '../../components/common/GoBackButton';

const Outer = styled.div`
  background-color: var(--page-bg-color);
  width: 100vw;
  min-height: calc(100vh - 125px);
  position: relative;
  display: flex;
  padding-bottom: 100px;

  @media ${(props) => props.theme.viewportMax10} {
    flex-direction: column;
    min-height: calc(100vh - 125px - 70px);
  }
`;

const ProfileArea = styled.div`
  width: 30%;
  padding: 15vh 1vw 1vh 1vw;
  text-align: center;

  button {
    color: #336fc9;
    font-size: 1.5rem;
    margin-top: 1vh;
  }

  .mediaBox {
    margin-top: 2vh;
    margin-bottom: 2vh;
    p {
      margin-top: 1vh;
    }
    #user-name {
      font-size: 1.5rem;
      font-weight: bold;
    }
    #user-changeInfo {
      color: #336fc9;
    }
  }

  @media ${(props) => props.theme.viewportMax10} {
    margin: 0 auto;
    margin-top: 4vh;
    width: 100%;
    padding: 0 1vw 3vh 1vw;

    .mediaBox {
      width: 40%;
      display: inline-block;
      text-align: left;
      p {
        margin-top: 2vh;
        justify-content: center;
        line-height: 3vh;
        font-size: 1.2rem;
      }
    }
  }

  @media ${(props) => props.theme.viewport3} {
    button {
      font-size: 1rem;
    }

    .mediaBox {
      width: 50%;
      display: inline-block;
      padding-bottom: 1vh;
      p {
        margin-top: 0;
        justify-content: center;
        font-size: 1rem;
      }
      #user-name {
        font-size: 1rem;
      }
    }
  }
`;

const ProfileImg = styled.img`
  width: 200px;
  height: 200px;
  padding: 10px 10px;
  border-radius: 50%;

  @media ${(props) => props.theme.viewportMax10} {
    margin-right: 5vw;
  }

  @media ${(props) => props.theme.viewport3} {
    width: 7rem;
    height: 7rem;
  }
`;

const ButtonArea = styled.div`
  height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  text-decoration: none;

  button {
    font-size: 1.2rem;
  }

  @media ${(props) => props.theme.viewportMax10} {
    width: 100vw;
    align-items: center;
    height: 10vh;
    position: absolute;
    bottom: 0;
  }
  @media ${(props) => props.theme.viewport3} {
    padding: 0 15vw;
    height: 20vh;
    justify-content: space-between;
    button {
      font-size: 1rem;
    }
  }
`;

const GridArea = styled.div`
  width: 100vw;
  padding: 2vh 3vw 2vh 5vw;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 200px 1fr 1fr;

  row-gap: 10px; /* row??? ????????? 10px??? */
  column-gap: 20px; /* column??? ????????? 20px??? */

  .item:nth-child(1) {
    border: none;
    grid-column: 1 / 4;
    grid-row: 1 / 2;
  }

  div {
    background-color: rgba(255, 255, 255, 0.5);
  }

  div:hover {
    border: 1px solid var(--page-bg-color);
  }

  img {
    width: 100%;
    height: 100%;
  }

  .more {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background-color: transparent;
  }

  p {
    font-size: 2rem;
    margin: 0 auto;
    font-weight: bold;
    color: #8e8e8e;
  }

  .moreView {
    font-size: 1.5rem;
    color: #336fc9;
    width: 5vw;
  }

  @media screen and (max-width: 1380px) {
    .moreView {
      font-size: 1.4rem;
      width: 6vw;
    }
  }

  @media ${(props) => props.theme.viewportMax10} {
    margin: 0 auto;
    margin-bottom: 10vh;
    padding: 0;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 100px 300px 300px;
    row-gap: 5px;
    column-gap: 3px;

    p {
      font-size: 2rem;
    }
    .item {
      margin: 0.5vh;
    }
    .moreView {
      width: 80px;
    }
  }

  @media ${(props) => props.theme.viewport5} {
    padding-left: 2vw;
    padding-right: 2vw;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 50px 150px 150px 150px;
    .item:nth-child(1) {
      border: none;
      grid-column: 1 / 3;
      grid-row: 1 / 2;
    }
    p {
      font-size: 1rem;
    }
    .moreView {
      font-size: 1rem;
      width: 50px;
      height: 3rem;
    }
  }
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function MyPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo } = useSelector((state) => state.itemReducer);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPosts, setcurrentPosts] = useState([]);

  useEffect(() => {
    axios({
      url: url + `/mypage?searchID=${userInfo.user_id}`,
      method: 'get',
      withCredentials: true,
    }).then((res) => {
      setcurrentPosts(res.data);
      dispatch(userPosts(res.data));
    });
  }, [userInfo.user_id, dispatch]);

  const changeUserInfo = () => {
    history.push('/edituserinfo');
  };

  const removeUserInfo = () => {
    setIsModalOpen(true);
  };

  const modalYesButtonHandlers = () => {
    const token = JSON.parse(localStorage.getItem('ATOKEN'));
    axios
      .delete(url + '/removeuser', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        localStorage.clear(token);
        dispatch(changeIsLogin(false));
        history.push('/');
      });
  };

  const modalNoButtonHandler = () => {
    setIsModalOpen(false);
  };

  const modalCloseButtonHandler = () => {
    setIsModalOpen(false);
  };

  const postClickHandler = (e) => {
    let elem = e.target;
    while (!elem.classList.contains('postItem')) {
      elem = elem.parentNode;
      if (!elem.classList.contains('myPagePostList')) {
        break;
      }
    }

    dispatch(updatePostId(elem.id));
    history.push({
      pathname: '/postread',
      state: { postId: elem.id },
    });
  };

  const moreViewHandler = () => {
    history.push('/mypost');
  };

  return (
    <Outer>
      <GoBackButton />
      <ProfileArea>
        <ProfileImg src={userInfo.user_Photo} />
        <div className='mediaBox'>
          <p id='user-name'>{userInfo.user_id}</p>
          <p id='user-gender'>{userInfo.gender === 1 ? '??????' : '??????'}</p>
          <p id='user-location'>?????? ?????? : {userInfo.location}</p>
          <p id='user-changeInfo' onClick={changeUserInfo}>
            ????????????
          </p>
        </div>
        <ButtonArea>
          <button onClick={() => history.push('/editpassword')}>???????????? ??????</button>
          <button onClick={removeUserInfo}>????????????</button>
          {isModalOpen === false ? null : (
            <ModalConfirm
              yesHandler={modalYesButtonHandlers}
              noHandler={modalNoButtonHandler}
              closeHandler={modalCloseButtonHandler}>
              <p>?????????????????????????</p>
              <p>????????? ????????? ?????????</p>
              <select name='pets' id='pet-select'>
                <option value=''>??????</option>
                <option value='notUseful'>????????? ?????? ?????? ??????</option>
                <option value='inconvenientDesign'>???????????? ?????????</option>
                <option value='otherOptions'>?????? ?????? ???????????? ??????</option>
                <option value='andSoForth'>??????</option>
              </select>
            </ModalConfirm>
          )}
        </ButtonArea>
      </ProfileArea>

      <GridArea className='myPagePostList'>
        <div className='item more'>
          <p>?????? ??? ??????</p>
        </div>
        {currentPosts.map((el) => (
          <div className={['item', 'postItem']} id={el.id} onClick={postClickHandler} key={el.id}>
            <img src={el.post_photo} alt='posts' />
          </div>
        ))}
        <button className='moreView' onClick={moreViewHandler}>
          ??? ??????
        </button>
      </GridArea>
    </Outer>
  );
}
