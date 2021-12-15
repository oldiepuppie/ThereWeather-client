// 스크롤 탑 버튼
import React, { useEffect, useState } from "react";
import styled from "styled-components"

const Button = styled.div`
  /* width: 100%; */
  height: 200px;
  position: fixed;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  right: 0;
  bottom: 0;
  transition: all 0.3s;
  display: none;
  img{
    width: 5rem;
    height: 5rem;
    margin-right: 2vh;
    opacity: 0.7;
    background-color: #FFFFFF;
    border-radius: 50%;
  }

  @media screen and (max-width: 1081px) {
    display: block;
    height: 170px;
    img{
      width: 4rem;
      height: 4rem;
      margin-right: 3vh;
    }
  }
  @media screen and (max-width: 375px) {
    height: 130px;
    img{
      width: 3rem;
      height: 3rem;
      margin-right: 2vh;
    }
  }
`

export default function TopButton() {
  // top button
  const [ScrollY, setScrollY] = useState(0);
  const [btnStatus, setBtnStatus] = useState(false);  // 버튼 상태

  // console.log(window.pageYOffset)
  // console.log(btnStatus)

  const handleFollow = () => {
    setScrollY(window.scrollY)
    if(ScrollY > 200){  // 200 이상이면 버튼이 보임
      setBtnStatus(true)
    }else{  // 200 이하일때 버튼이 사라짐
      setBtnStatus(false)
    }
  }

  // 클릭시 위로 올라감
  const scrollToTop = () => {
    // e.preventDefault() // 새로고침 방지
    window.scrollTo({top: 0, behavior: 'smooth'}) // 위로 올라감
    setScrollY(0);  // 올라가면 다시 0으로 초기화
    setBtnStatus(false); // 버튼 다시 사라짐
  }

  useEffect(() => {
    window.addEventListener('scroll', handleFollow)
    return () => {
      window.removeEventListener('scroll', handleFollow)
    }
  })

  return(
    <Button>
      {
        btnStatus?
        <img
          src={`${process.env.PUBLIC_URL}img/scroll-up.png`} alt="top"
          onClick={scrollToTop}
        /> : null
      }
    </Button>
  )
}