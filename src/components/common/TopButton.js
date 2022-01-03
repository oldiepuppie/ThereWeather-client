import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Button = styled.div`
  height: 200px;
  position: fixed;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  right: 0;
  bottom: 0;
  transition: all 0.3s;
  display: none;

  img {
    width: 5rem;
    height: 5rem;
    margin-right: 2vh;
    opacity: 0.7;
    background-color: #ffffff;
    border-radius: 50%;
  }

  @media ${(props) => props.theme.viewportMax10} {
    display: block;
    height: 170px;
    img {
      width: 4rem;
      height: 4rem;
      margin-right: 3vh;
    }
  }

  @media ${(props) => props.theme.viewport3} {
    height: 130px;
    img {
      width: 3rem;
      height: 3rem;
      margin-right: 2vh;
    }
  }
`;

export default function TopButton() {
  const [ScrollY, setScrollY] = useState(0);
  const [btnStatus, setBtnStatus] = useState(false); // 버튼 상태

  const handleFollow = () => {
    setScrollY(window.scrollY);
    if (ScrollY > 200) {
      setBtnStatus(true);
    } else {
      setBtnStatus(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 위로 올라감
    setScrollY(0); // 올라가면 다시 0으로 초기화
    setBtnStatus(false); // 버튼 다시 사라짐
  };

  useEffect(() => {
    window.addEventListener('scroll', handleFollow);
    return () => {
      window.removeEventListener('scroll', handleFollow);
    };
  });

  return (
    <Button>
      {btnStatus ? <img src={`${process.env.PUBLIC_URL}img/scroll-up.png`} alt='top' onClick={scrollToTop} /> : null}
    </Button>
  );
}
