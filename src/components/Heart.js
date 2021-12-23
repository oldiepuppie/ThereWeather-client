import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export const Bookmark = ({ bookmarkHandler, color }) => {
  return (
    <button className='bookmarkContainer' onClick={bookmarkHandler}>
      <FontAwesomeIcon icon={faHeart} className='heart' size='3x' color={color} />
    </button>
  );
};
