import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Outer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: var(--modal-bg-color);
  z-index: 200;
`;

const Popup = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 50vw;
  min-width: 300px;
  max-width: 500px;
  height: 40vw;
  min-height: 200px;
  max-height: 300px;
  background-color: var(--modal-confirm-bg);
  font-size: 1.5rem;
  border-radius: 1.5rem;

  & > article {
    margin: 0.5rem;
  }

  & .closeButtonArea {
    align-self: flex-end;
    margin: 0 2rem;
    font-size: 1.5rem;
  }

  & select {
    font-size: 1rem;
    margin: 0.5rem;
    padding: 0.3rem;
  }
`;

const Button = styled.button`
  width: 30%;
  min-width: 80px;
  max-width: 120px;
  margin: 0.8rem;
  padding: 0.5rem;
  font-size: 1.2rem;
  border-radius: 0.5rem;
  background-color: var(--modal-confirm-button-bg);

  &:active {
    border: none;
    box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.5), inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2),
      inset 4px 4px 6px 0 rgba(0, 0, 0, 0.4);
  }
`;

export default function ModalConfirm({ children, closeHandler, yesHandler, noHandler }) {
  const yesButtonHandler = () => {
    yesHandler();
  };

  const noButtonHandler = () => {
    noHandler();
  };

  const closeButtonHandler = () => {
    closeHandler();
  };

  return (
    <Outer className='modalBackground'>
      <Popup className='modalConfirm'>
        <article className='closeButtonArea'>
          <button className='modalCloseButton' onClick={closeButtonHandler}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </article>
        <article className='confirmText'>{children}</article>
        <article className='modalConfirmButtons'>
          <Button className='modalButtonYes' onClick={yesButtonHandler}>
            예
          </Button>
          <Button className='modalButtonNo' onClick={noButtonHandler}>
            아니오
          </Button>
        </article>
      </Popup>
    </Outer>
  );
}
