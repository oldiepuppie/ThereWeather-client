import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { userPosts, updatePostId } from '../../actions/index';
import GoBackButton from '../../components/common/GoBackButton';
import Pagination from '../../components/common/Pagination';

const Outer = styled.div`
  position: relative;
  background-color: var(--page-bg-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding: 2rem;

  h2 {
    align-self: flex-start;
    margin: 2rem 0;
  }

  button {
    font-size: 1.5rem;
  }

  @media screen and (min-width: 1500px) {
    padding-left: 3vh;
    padding-right: 3vh;
  }

  @media ${(props) => props.theme.viewport3} {
    padding-top: 2vh;
  }
`;

const GridArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 300px 300px;
  grid-gap: 1.5rem;
  min-height: 70vh;
  margin: 1rem;
  p {
    font-size: 28px;
  }

  .postItem {
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
  }
  .postItem:hover {
    border: 1px solid #d5d8dc;
  }

  @media screen and (min-width: 2100px) {
    height: 50vh;
    width: 300px;
  }

  @media ${(props) => props.theme.viewportMax10} {
    padding-left: 5vw;
    padding-right: 5vw;
    height: auto;
    grid-template-columns: 1fr 1fr;
  }

  @media ${(props) => props.theme.viewport5} {
    padding-left: 2vw;
    padding-right: 2vw;
    p {
      font-size: 20px;
    }
  }

  @media ${(props) => props.theme.viewport3} {
    height: auto;
  }
`;

const PostImg = styled.img`
  width: 100%;
  height: 100%;
  background-color: #ffffff;

  @media screen and (min-width: 2100px) {
    width: 300px;
    height: 300px;
  }
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function MyPost() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo } = useSelector((state) => state.itemReducer);
  const [currentPosts, setcurrentPosts] = useState([]);

  useEffect(() => {
    axios({
      url: url + `/mypost?searchID=${userInfo.user_id}`,
      method: 'get',
      withCredentials: true,
    }).then((res) => {
      setcurrentPosts(res.data);
      dispatch(userPosts(res.data));
    });
  }, [dispatch, userInfo.user_id]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const lastIdx = currentPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const slicedData = (dataArr) => {
    return dataArr.slice(firstIdx, lastIdx);
  };

  const postClickHandler = (e) => {
    let elem = e.target;
    while (!elem.classList.contains('postItem')) {
      elem = elem.parentNode;
      if (!elem.classList.contains('myPostList')) {
        break;
      }
    }

    dispatch(updatePostId(elem.id));
    history.push({
      pathname: '/postread',
      state: { postId: elem.id },
    });
  };

  return (
    <Outer className='MyPostPage'>
      <div>
        <GoBackButton className='gobackButton' />
        <h2>?????? ??? ?????????</h2>
      </div>

      <GridArea className='myPostList'>
        {slicedData(currentPosts).map((el) => (
          <div className={['postItem']} id={el.id} onClick={postClickHandler} key={el.id}>
            <PostImg src={el.post_photo} alt='posts' />
          </div>
        ))}
      </GridArea>

      <div className='paginationContainer'>
        <Pagination
          dataLength={currentPosts.length}
          itemsPerPage={itemsPerPage}
          numberButtonClickHandler={setCurrentPage}
        />
      </div>
    </Outer>
  );
}
