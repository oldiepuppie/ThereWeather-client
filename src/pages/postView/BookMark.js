import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import styled from 'styled-components';
import { updatePostId } from '../../actions/index';
import { useHistory } from 'react-router';
import getDateFormatted from '../../utilities/getDateFormatted';
import { default as PaginationWithArrow } from '../../components/common/Pagination';

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: var(--page-bg-color);
  width: 100vw;
  min-height: 100vh;
`;

const Container = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  grid-template-columns: repeat(2, 40vw);
  margin: 5rem;

  .BookMarkContainer {
    gap: 0.2rem;
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    justify-content: space-around;
    border: 1px solid #dbdbdb;
    border-radius: 3px;
  }

  @media ${(props) => props.theme.viewportMax10} {
    margin: 3rem 2rem;
    gap: 2rem;
    grid-template-columns: 80vw;
    grid-template-areas: 'div';
  }

  @media ${(props) => props.theme.viewport3} {
    margin: 1rem;
    grid-auto-rows: 500px;
    gap: 0;
    .BookMarkContainer {
      height: 80%;
      display: flex;
      flex-direction: column;
    }
  }
`;

const BookMarkPhoto = styled.div`
  .postItem {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .postPicture {
    margin: 1rem 2rem 1rem 1rem;
    padding: 0;
    height: 25vh;
    align-items: center;
  }

  .postImg {
    margin: 0.5rem;
    width: 250px;
    height: 250px;
  }

  .postImg:hover {
    transform: scale(1.05);
    transition: 0.5s ease-in-out;
  }

  @media ${(props) => props.theme.viewportMax10} {
    .postPicture {
      height: 20vh;
    }
  }

  @media ${(props) => props.theme.viewport3} {
    .postPicture {
      margin: 0;
    }
  }
`;

const BookMarkList = styled.div`
  margin: 1rem;
  line-height: 3rem;
  flex-direction: column;
  flex-basis: 15rem;
  justify-content: flex-start;

  .postTitle {
    font-weight: bold;
    font-size: 2rem;
  }

  .postDate {
    font-size: 1.5rem;
  }

  .postWeather {
    width: 3rem;
    height: 3rem;
  }

  img {
    width: 100%;
    height: 100%;
  }

  @media ${(props) => props.theme.viewportMax10} {
    line-height: 2rem;

    .postTitle {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .postDate {
      font-size: 1rem;
    }

    .postWeather {
      font-size: 0.5rem;
      width: 30px;
      height: 30px;
    }
  }

  @media ${(props) => props.theme.viewport3} {
    margin: 0.1rem 0 0 0.5rem;
    line-height: 1.4rem;

    .postTitle {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .postDate {
      font-size: 1rem;
    }

    .postWeather {
      font-size: 0.5rem;
      width: 30px;
      height: 30px;
    }
  }
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function BookMark() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo, readPostId, postInfo } = useSelector((state) => state.itemReducer);
  const [bookmarkList, setBookmarkList] = useState([]);
  const postId = Number(readPostId);

  useEffect(() => {
    axios({
      url: url + '/bookmarklist',
      method: 'post',
      data: {
        user_id: userInfo.id,
        post_id: postId,
        post_info: postInfo,
      },
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }).then((res) => {
      setBookmarkList(res.data);
    });
  }, [postId, postInfo, userInfo.id]);

  const postClickHandler = (e) => {
    let elem = e.target;
    while (!elem.classList.contains('postItem')) {
      elem = elem.parentNode;
      if (!elem.classList.contains('BookMarkContainer')) {
        break;
      }
    }

    dispatch(updatePostId(elem.id));
    history.push({
      pathname: '/bookmarkpost',
      state: { postId: elem.id },
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const lastIdx = currentPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const slicedData = (dataArr) => {
    return dataArr.slice(firstIdx, lastIdx);
  };

  return (
    <Outer>
      <Container>
        {slicedData(bookmarkList).map((el) => {
          return (
            <div className='BookMarkContainer' key={el.id}>
              <BookMarkPhoto>
                <div className={['postItem']} id={el.id} onClick={postClickHandler} key={el.id}>
                  <img className='postImg' key={el.id} src={el.post_photo} alt='posts' />
                </div>
              </BookMarkPhoto>
              <BookMarkList>
                <div className='test' key={el.id}>
                  <p className='postDate'>{getDateFormatted(el.createdAt)}</p>
                  <p className='postWeather sky'> {el.weather} </p>
                  <p className='postWeather wind'>{el.wind} </p>
                  <p className='postWeather temp'>{el.temp} </p>
                </div>
              </BookMarkList>
            </div>
          );
        })}
      </Container>

      <PaginationWithArrow
        dataLength={bookmarkList.length}
        itemsPerPage={8}
        numberButtonClickHandler={setCurrentPage}
      />
    </Outer>
  );
}
