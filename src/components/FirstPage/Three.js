import styled from "styled-components";
import { HalfPage, AnimatedP, AnimatedImg } from "./One";
import { TitleAndContents, ContentsUnderTitle, AnimatedTitle } from "./Two";

export const TwoPictures = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    width: 40vw;
  }

  @media screen and (min-width: 1081px) {
    & > img {
      width: 40%;
    }
  }
`;

export default function Three({
  delayOne, delayTwo, delayThree, delayFour, delayFive
}) {
  return (
    <TitleAndContents className={["landingPagePart", "three"]}>
      <AnimatedTitle delay={delayOne}>
        step 2
      </AnimatedTitle>
      <ContentsUnderTitle className="contents">
        <HalfPage className="half-page">
          <AnimatedP className="desc" delay={delayTwo}>
            자신이 있는 곳의 <br/>
            하늘 사진을 찍어서 <br/>
            예보글을 작성하세요.
          </AnimatedP>
          <div className="picture-png left">
            <AnimatedImg
              src="img/firstpage/photos.png"
              alt="photos"
              delay={delayThree}
            />
          </div>
        </HalfPage>

        <HalfPage className="half-page">
          <AnimatedP className="desc" delay={delayFour}>
            하늘 사진을 공유하여 <br/>
            다른사람에게 <br/>
            도움을 줄 수도 있어요.
          </AnimatedP>
          <TwoPictures className="picture-png right">
            <AnimatedImg
              src="img/firstpage/mobile.png"
              alt="touching mobile phone"
              delay={delayFive}
            />
            <AnimatedImg
              src="img/firstpage/after_the_rain.png"
              alt="holding umbrella"
              delay={delayFive}
            />
          </TwoPictures>
        </HalfPage>
      </ContentsUnderTitle>
    </TitleAndContents>
  );
}