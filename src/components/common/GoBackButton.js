import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

const Button = styled.button`
  top: 1.5vh;
  left: 0;
  position: fixed;
  z-index: 100;
  display: none;
  padding: 1rem 1rem 1rem 0.3rem;

  .fa-fw {
    font-size: 50px;
  }

  @media ${(props) => props.theme.viewportMax10} {
    display: inline;
  }

  @media ${(props) => props.theme.viewport3} {
    .fa-fw {
      font-size: 35px;
    }
  }
`;

export default function GoBackButton() {
  const history = useHistory();
  const goBackHandler = () => {
    history.goBack();
  };

  return (
    <Button>
      <FontAwesomeIcon icon={faChevronLeft} className='fa-fw' color='#ACB5BD' onClick={goBackHandler} />
    </Button>
  );
}
