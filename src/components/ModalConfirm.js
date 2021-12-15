// TODO 회원탈퇴, 글 수정, 글 삭제에 사용 예정

import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { changeIsLogin } from "../actions/index"
import { useHistory } from "react-router-dom"

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
    margin: .5rem;
  }

  & .closeButtonArea {
    align-self: flex-end;
    margin: 0 2rem;
    font-size: 1.5rem;
  }

  & select {
    font-size: 1rem;
    margin: .5rem;
    padding: .3rem;
  }
`;

const Button = styled.button`
  width: 30%;
  min-width: 80px;
  max-width: 120px;
  margin: .8rem;
  padding: .5rem;
  font-size: 1.2rem;
  border-radius: .5rem;
  background-color: var(--modal-confirm-button-bg);

  &:active{
    border: none;
    box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
    inset -4px -4px 6px 0 rgba(255,255,255,.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .4);
  }
`;


export default function ModalConfirm({ children, closeHandler, yesHandler, noHandler }) {
  // const dispatch = useDispatch()
  // const history = useHistory()
  // const { isLogin } = useSelector((state) => state.itemReducer)
  
  const yesButtonHandler = () => {
    yesHandler();
  }

  const noButtonHandler = () => {
    noHandler();
  }

  const closeButtonHandler = () => {
    closeHandler();
  }

  return (
    <Outer className="modalBackground">
      <Popup className="modalConfirm">
        <article className="closeButtonArea">
          <button className="modalCloseButton" onClick={closeButtonHandler}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </article>
        <article className="confirmText">
          {children}
        </article>
        <article className="modalConfirmButtons">
          <Button className="modalButtonYes" onClick={yesButtonHandler}>예</Button>
          <Button className="modalButtonNo" onClick={noButtonHandler}>아니오</Button>
        </article>
      </Popup>
    </Outer>
  );
}


/* 사용 예시
- props
  - children
    - 여는 태그와 닫는 태그 사이에 태그나 텍스트를 넣을 수 있다
  - closeHandler
    - 'x' 버튼을 눌렀을 때의 이벤트 함수 지정
  - yesHandler
    - '예' 버튼 눌렀을 때 이벤트 함수
  - noHandler
    - '아니오' 버튼 눌렀을 때 이벤트 함수

(1) 삭제
  <ModalConfirm>삭제하시겠습니까?</ModalConfirm>

(2) 수정
  <ModalConfirm>수정하시겠습니까?</ModalConfirm>

(3) 탈퇴
  <ModalConfirm>
    <p>탈퇴하시겠습니까?</p>
    <p>이유를 선택해 주세요</p>
    <select name="pets" id="pet-select">
      <option value="">선택</option>
      <option value="notUseful">사용을 많이 하지 않음</option>
      <option value="inconvenientDesign">디자인이 불편함</option>
      <option value="otherOptions">다른 앱을 이용하기 위해</option>
      <option value="andSoForth">기타</option>
    </select>
  </ModalConfirm>
*/