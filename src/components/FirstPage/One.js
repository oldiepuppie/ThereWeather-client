import styled from 'styled-components';

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;

  @media ${(props) => props.theme.viewportMin10} {
    flex-direction: row;
  }
`;

export const HalfPage = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(var(--mobile-page-height) - var(--mobile-menubar-height));

  & img {
    margin: 2rem;
    width: 50vw;
    height: auto;
  }

  & p {
    font-size: 1.5rem;
    margin: 1rem;
    line-height: 150%;
  }

  @media ${(props) => props.theme.viewportMin10} {
    height: var(--desktop-page-height);
    & img {
      margin: 2rem;
      width: 95%;
      height: auto;
    }

    & p {
      margin: 2rem;
      width: 35vw;
      height: auto;
    }
  }
`;

export const AnimatedP = styled.p`
  animation: fade-in ease-in 1 backwards;
  animation-duration: ${(props) => props.duration || '1.5s'};
  animation-delay: ${(props) => props.delay || null};
`;

export const AnimatedImg = styled.img`
  animation: fade-in ease-in 1 backwards;
  animation-duration: ${(props) => props.duration || '.5s'};
  animation-delay: ${(props) => props.delay || null};
`;

export default function One({ delayOne, delayTwo }) {
  return (
    <Contents className={['landingPagePart', 'one']}>
      <HalfPage className='half-page'>
        <AnimatedP className='desc'>
          일기 예보가 <br />
          믿음직스럽지 못하시다구요?
          <br />
        </AnimatedP>
        <div className='picture-png left'>
          <AnimatedImg src='img/firstpage/phone-and-human.png' alt='human with phone' />
        </div>
      </HalfPage>

      <HalfPage className='half-page'>
        <AnimatedP className='desc' delay={delayOne}>
          동네 주민이 올린 하늘의 사진을 <br />
          실시간으로 확인할 수 있어요.
          <br />
        </AnimatedP>
        <AnimatedP className='desc' delay={delayOne}>
          여러분도 하늘사진을 공유하고 <br />
          동네 날씨예보관이 되어 보세요!
        </AnimatedP>
        <div className='picture-png right'>
          <AnimatedImg src='img/firstpage/town.png' alt='street' delay={delayTwo} />
        </div>
      </HalfPage>
    </Contents>
  );
}
