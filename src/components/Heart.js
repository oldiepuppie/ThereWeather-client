import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export const Bookmark = ({ bookmarkHandler, color })  => {

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