import styled from "styled-components";
import { Contents, HalfPage, AnimatedP, AnimatedImg } from "./One";

export const TitleAndContents = styled(Contents)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > h2 {
    padding: 3rem;
    font-size: 3rem;
    text-align: center;
  }

  @media screen and (min-width: 1081px) {
    height: 110vh;
    & >h2 {
      height: 12rem;
      padding: 5rem;
    }
  }
`;

export const ContentsUnderTitle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 1081px) {
    flex-direction: row;
    height: calc(var(--desktop-page-height) - 12rem);
  }
`;

export const AnimatedTitle = styled.h2`
  animation: fade-in ease-in 1 backwards;
  animation-duration: ${props => props.duration || '.3s'};
  animation-delay: ${props => props.delay || null};
`;

export default function Two({
  delayOne, delayTwo, delayThree, delayFour, delayFive
}) {
  return (
    <TitleAndContents className={["landingPagePart", "two"]}>
      <AnimatedTitle delay={delayOne}>
        step 1
      </AnimatedTitle>
      <ContentsUnderTitle className="contents">
        <HalfPage className="half-page" delay={delayTwo}>
          <AnimatedP className="desc">
            사는 곳이나 <br/>
            여행지를 검색하세요.
          </AnimatedP>
          <div className="picture-png left">
            <AnimatedImg
              src="img/firstpage/web_search.png"
              alt="web surfing"
              delay={delayThree}
            />
          </div>
        </HalfPage>

        <HalfPage className="half-page">
          <div className="picture-png right">
            <AnimatedImg
              src="img/firstpage/adventure_map.png"
              alt="walking"
              delay={delayFour}
            />
          </div>
          <AnimatedP className="desc" delay={delayFive}>
            여행을 준비중이시라면 <br/>
            여행지에 사는 사람이 올린 <br/>
            사실적인 예보글을 토대로 <br/>
            계획해보세요.
        </AnimatedP>
        </HalfPage>
      </ContentsUnderTitle>
    </TitleAndContents>
  );
}

// style={{ opacity: `${opacityOffset}`}}