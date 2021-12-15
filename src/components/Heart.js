// import { useState, useEffect } from "react"
// import styled from "styled-components"
// import { useDispatch } from "react-redux"
// import { changeBookmark } from "../actions/index"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

// 북마크 하트 버튼
// const Container = styled.img`

// `;

export const Bookmark = ({ like, bookmarkHandler, color })  => {

  return(
    <button className="bookmarkContainer" onClick={bookmarkHandler}>
      <FontAwesomeIcon
        icon={faHeart}
        className="heart"
        size="3x"
        color={color}
      />
    </button>
  )
}

// 사용 예시
// const [bookmarked, setBookmarked] = useState(false);
// const bookmarkHandler = (e) => {
//   setBookmarked(prev => !prev);
// }
// <Bookmark bookmarkHandler={bookmarkHandler} color={bookmarked ? '#eb425b' : '#aaa'}/>