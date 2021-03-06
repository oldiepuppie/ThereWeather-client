import { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { changeGender } from '../../actions/index';

const ToggleContainer = styled.div`
  position: relative;
  margin-top: 8rem;
  left: 47%;
  cursor: pointer;
  display: flex;

  > .toggle-container {
    width: 50px;
    height: 24px;
    border-radius: 30px;
    background-color: skyblue;
    margin-right: -10rem;
  }

  > .toggle-container.toggle--checked {
    width: 50px;
    height: 24px;
    border-radius: 30px;
    background-color: pink;
  }

  > .toggle-circle {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    /* background-color: #ffffff; */
    background-color: blue;
    transition-duration: 0.5s;
  }

  > .toggle-circle.toggle--checked {
    position: absolute;
    top: 1px;
    left: 27px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    /* background-color: #ffffff; */
    background-color: red;
  }
`;

const Desc = styled.div`
  text-align: center;
`;

const Toggle = () => {
  const dispatch = useDispatch();
  const [isOn, setisOn] = useState(2);

  const toggleHandler = () => {
    isOn === 1 ? setisOn(2) : setisOn(1);
    dispatch(changeGender(isOn));
  };

  return (
    <>
      <ToggleContainer onClick={toggleHandler}>
        <div className={isOn === 1 ? 'toggle-container toggle--checked' : 'toggle-container'} />
        <div className={isOn === 1 ? 'toggle-circle toggle--checked' : 'toggle-circle'} />
        <Desc>{isOn === 1 ? '여성' : '남성'}</Desc>
      </ToggleContainer>
    </>
  );
};

export default Toggle;
