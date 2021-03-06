import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import getDateFormatted from '../../utilities/getDateFormatted';
import { default as Bookmark } from '../../components/common/Heart';
import ModalConfirm from '../../components/common/ModalConfirm';
import GoBackButton from '../../components/common/GoBackButton';
import TopButton from '../../components/common/TopButton';

const Outer = styled.div`
  width: 100vw;
  background-color: var(--page-bg-color);

  .todayCodi {
    margin: 0 auto;
    width: 60%;
    text-align: center;
    color: #2e2e2e;
    padding-top: 2vh;
    border-top: 1px solid #aaa;
  }

  h2.warning--nodata {
    color: #c60239;
    font-size: 3rem;
    margin: 0 1rem;
  }

  @media ${(props) => props.theme.viewportMax10} {
    .todayCodi {
      margin-top: 2vh;
      font-weight: bold;
    }
  }
`;

const PostHeader = styled.div`
  padding-top: 8vh;
  align-items: center;

  @media ${(props) => props.theme.viewportMax10} {
    padding-top: 5vh;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 960px;
  text-align: center;
  margin: 0 auto;

  span {
    font-size: 2rem;
  }

  @media ${(props) => props.theme.viewportMax10} {
    width: 70%;
  }
  @media ${(props) => props.theme.viewport3} {
    span {
      font-size: 1.2rem;
    }
  }
`;

const BookmarkIcon = styled(Bookmark)`
  float: right;

  & .heart {
    cursor: pointer;
    color: #aaa;
  }
`;

const Profile = styled.div`
  width: 60rem;
  margin: 0 auto;
  margin-top: 2vh;
  padding-bottom: 3vh;
  border-bottom: 1px solid #aaa;
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;

  .profileInfo {
    display: flex;
    align-items: center;
  }
  .location {
    font-size: 1.2rem;
  }
  span {
    margin-left: 1vh;
  }
  span.date {
    font-size: 0.8rem;
    color: #707b7c;
  }

  @media ${(props) => props.theme.viewportMax10} {
    width: 70%;
  }
  @media ${(props) => props.theme.viewport5} {
    .location {
      margin-top: 1.2vh;
      font-size: 1.2rem;
    }
  }
  @media ${(props) => props.theme.viewport3} {
    width: 80%;
    margin-top: 4vh;
    span {
      font-size: 0.5rem;
    }
    .location {
      font-size: 0.5rem;
    }
  }
`;

const ProfileImg = styled.img`
  border: 1px solid #aaa;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  @media ${(props) => props.theme.viewport3} {
    width: 2rem;
    height: 2rem;
  }
`;

const PostImg = styled.img`
  width: 60rem;
  height: 40rem;
  display: block;
  margin: 3vh auto;

  @media ${(props) => props.theme.viewportMax10} {
    width: 70%;
    height: 30rem;
  }

  @media ${(props) => props.theme.viewport3} {
    width: 80%;
    height: 18rem;
  }
`;

const WeatherInfo = styled.div`
  width: 330px;
  margin-top: 4vh;
  display: flex;
  margin: 0 auto;
  margin-bottom: 2vh;
  justify-content: space-between;

  @media ${(props) => props.theme.viewportMax10} {
    margin-top: 1vh;
    margin-bottom: 1vw;
    justify-content: space-around;
  }

  @media ${(props) => props.theme.viewport3} {
    width: 50%;
    margin-bottom: 3vh;
  }
`;

const Icon = styled.img`
  @media ${(props) => props.theme.viewportMax10} {
    width: 4rem;
  }

  @media ${(props) => props.theme.viewport3} {
    width: 3rem;
  }
`;

const TodayCodi = styled.div`
  width: 20%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-top: 3vh;
  margin-bottom: 3vh;

  .warning {
    display: none;
  }

  & p.warning {
    font-size: 0.9rem;
    width: 6rem;
    height: 6rem;
    text-align: center;
  }

  img {
    width: 4rem;
    height: auto;
  }

  @media ${(props) => props.theme.viewportMax10} {
    width: 50%;
  }

  @media ${(props) => props.theme.viewport3} {
    width: 50vw;
  }
`;

const Post = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 auto;
  margin-bottom: 5vh;
  padding: 1rem;
  width: 60rem;

  p {
    line-height: 2.5rem;
    font-size: 1.5rem;
  }

  @media ${(props) => props.theme.viewportMax10} {
    width: 70%;
  }

  @media ${(props) => props.theme.viewport3} {
    width: 85%;
    margin-top: 4vh;
    p {
      line-height: 1.5rem;
      font-size: 1rem;
    }
  }
`;

const Buttons = styled.div`
  width: 15rem;
  margin: 0 auto;
  padding-bottom: 10vh;

  .button {
    width: 5rem;
    height: 3rem;
    border-radius: 5px;
    background-color: var(--button-bg-normal);
    font-size: 1.2rem;
  }
  .button2 {
    margin-left: 5rem;
  }
  .button:before {
    height: 0%;
    width: 2px;
  }
  .button:active {
    border: none;
    box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.5), inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2),
      inset 4px 4px 6px 0 rgba(0, 0, 0, 0.4);
  }

  @media ${(props) => props.theme.viewportMax10} {
    .button2 {
      margin-left: 80px;
    }
  }
  @media ${(props) => props.theme.viewport3} {
    width: 40%;
    display: flex;
    justify-content: space-between;
    .button {
      width: 3rem;
      height: 2rem;
      font-size: 1rem;
    }
    .button2 {
      margin-left: 0;
    }
  }
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function PostRead() {
  const history = useHistory();
  const { readPostId, userInfo } = useSelector((state) => state.itemReducer);
  const postIds = Number(readPostId);

  const [postData, setPostData] = useState({
    id: null,
    post_title: '',
    user_id: '',
    createdAt: '',
    updatedAt: '',
    xLocation: '',
    yLocation: '',
    post_photo: '',
    weather: '',
    wind: '',
    temp: '',
    top_id: '',
    bottom_id: '',
    post_content: '',
    address: '',
  });
  const [noIdWarning, setNoIdWarning] = useState('');

  useEffect(() => {
    function getOnePost(postId) {
      axios
        .get(`${url}/readpost`, {
          headers: { 'Content-Type': 'application/json' },
          params: { id: postId },
          withCredentials: true,
        })
        .then((res) => {
          return setPostData((prev) => res.data);
        })
        .catch((err) => err);
    }

    let id;
    if (history.location.state) {
      id = history.location.state.postId;
    } else {
      id = readPostId;
    }

    if (!id) {
      setNoIdWarning((prev) => '????????? ???????????????.');
    } else {
      getOnePost(id);
    }
  }, [history.location.state, readPostId]);

  const [bookmarked, setBookmarked] = useState(false);
  const [edit, setEdit] = useState(false);
  const [removePost, setRemovePost] = useState(false);

  const editPost = () => {
    setEdit(true);
  };

  const deletePost = (e) => {
    setRemovePost(true);
  };

  const editModalYes = () => {
    axios({
      url: url + '/editpost',
      method: 'put',
      data: {
        user_id: userInfo.user_id,
        post_id: postIds,
      },
      withCredentials: true,
    }).then((res) => {
      alert(res.data);
      if (res.data === '???????????? ???????????? ????????????.') {
        history.push('/mypage');
      } else {
        history.push('/editpost');
      }
    });
    setEdit(false);
  };

  const removeModalYes = () => {
    const token = JSON.parse(localStorage.getItem('ATOKEN'));
    axios({
      url: url + '/deletepost',
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
      data: { post_id: postIds },
      withCredentials: true,
    }).then((res) => {
      alert(res.data);
      history.push('/mypage');
    });
    setRemovePost(false);
  };

  const modalNoButtonHandler = () => {
    setRemovePost(false);
    setEdit(false);
  };

  const modalCloseButtonHandler = () => {
    setRemovePost(false);
    setEdit(false);
  };

  const bookmarkHandler = (e) => {
    axios({
      url: url + '/bookmark',
      method: 'post',
      data: { user_id: userInfo.id, post_id: postIds },
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }).then((res) => {
      setBookmarked((prev) => !prev);
    });
  };

  return (
    <Outer>
      {noIdWarning.length !== 0 ? <h2 className='warning--nodata'>{noIdWarning}</h2> : ''}
      <TopButton />
      <GoBackButton />
      <PostHeader className='postHeader'>
        <Title className='title'>
          <span>{postData.post_title}</span>
          <BookmarkIcon bookmarkHandler={bookmarkHandler} color={bookmarked ? '#aaa' : '#ED4956'} />
        </Title>

        <Profile className='userProfile'>
          <div className='profileInfo'>
            <ProfileImg src={postData.user_Photo} />
            <span className='nickName'>{postData.nickName}</span>
            <span className='date'>{getDateFormatted(postData.updatedAt)}</span>
          </div>
          <div>
            <p className='location'>{postData.address}</p>
          </div>
        </Profile>
      </PostHeader>
      <PostImg src={postData.post_photo} alt='post picture' />

      <WeatherInfo>
        {!postData.weather ? (
          ''
        ) : (
          <Icon src={`${process.env.PUBLIC_URL}img/icons-write/${postData.weather}.png`} alt='???????????????' />
        )}
        {!postData.wind ? (
          ''
        ) : (
          <Icon src={`${process.env.PUBLIC_URL}img/icons-write/${postData.wind}.png`} alt='???????????????' />
        )}
        {!postData.temp ? (
          ''
        ) : (
          <Icon src={`${process.env.PUBLIC_URL}img/icons-write/${postData.temp}.png`} alt='???????????????' />
        )}
      </WeatherInfo>

      {(!postData.outer_id || postData.outer_id === 'default') &&
      (!postData.top_id || postData.top_id === 'default') &&
      (!postData.bottom_id || postData.top_id === 'default') ? null : (
        <>
          <h2 className='todayCodi'>????????? ??????</h2>
          <TodayCodi>
            {!postData.outer_id || postData.outer_id === 'default' ? (
              <p className='warning'>?????? ???????????? ????????????</p>
            ) : (
              <Icon src={`${process.env.PUBLIC_URL}img/codi/${postData.outer_id}.png`} alt='??????' />
            )}
            {!postData.top_id || postData.top_id === 'default' ? (
              <p className='warning'>?????? ???????????? ????????????</p>
            ) : (
              <Icon src={`${process.env.PUBLIC_URL}img/codi/${postData.top_id}.png`} alt='??????' />
            )}
            {!postData.bottom_id || postData.top_id === 'default' ? (
              <p className='warning'>?????? ???????????? ????????????</p>
            ) : (
              <Icon src={`${process.env.PUBLIC_URL}img/codi/${postData.bottom_id}.png`} alt='??????' />
            )}
          </TodayCodi>
        </>
      )}

      <Post>
        <p>{postData.post_content}</p>
      </Post>

      <Buttons>
        <button className='button button1' value='delete' onClick={deletePost}>
          ??????
        </button>
        {removePost === false ? null : (
          <ModalConfirm
            yesHandler={removeModalYes}
            noHandler={modalNoButtonHandler}
            closeHandler={modalCloseButtonHandler}>
            ?????????????????????????
          </ModalConfirm>
        )}
        <button className='button button2' onClick={editPost}>
          ??????
        </button>
        {edit === false ? null : (
          <ModalConfirm
            yesHandler={editModalYes}
            noHandler={modalNoButtonHandler}
            closeHandler={modalCloseButtonHandler}>
            ?????????????????????????
          </ModalConfirm>
        )}
      </Buttons>
    </Outer>
  );
}
