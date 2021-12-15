import { HalfPage, AnimatedP, AnimatedImg } from "./One"
import { TitleAndContents, ContentsUnderTitle, AnimatedTitle } from "./Two"
import { useHistory } from "react-router-dom"
import { TwoPictures } from "./Three"
import styled from "styled-components"

const Button = styled.button`
// width: 140px;
// height: 45px;
// font-size: 11px;
border:3px solid pink;
font-size: ${(props) => (props.isText ? "1.6rem" : "1.6rem")};
font-family: 'IBM Plex Sans KR', sans-serif;

padding: ${(props) => (props.bgGrey ? ".6rem" : ".4rem")};
margin: 0.5rem;
border-radius: 10%;
color: ${(props) => (props.bgGrey || props.isText ? "#ff6384" : "grey")};
background-color: ${(props) =>
    props.bgGrey || props.isText ? "white" : "white"};
text-transform: uppercase;
letter-spacing: 2.5px;
font-weight: 500;
color: #000;
background-color: #fff;
// border: none;
border-radius: 45px;
box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
transition: all 0.3s ease 0s;
cursor: pointer;
outline: none;
}

&:hover {
    background-color: pink;
    box-shadow: 0px 15px 20px #f7cac9;
    color: #fff;
transform: translateY(-4px);
}
`
const Buttons = styled.button`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`
export default function Four({
    delayOne,
    delayTwo,
    delayThree,
    delayFour,
    delayFive,
}) {
    const history = useHistory()
    return (
        <TitleAndContents className={["landingPagePart", "four"]}>
            <AnimatedTitle delay={delayOne}>step 3</AnimatedTitle>
            <ContentsUnderTitle className="contents">
                <HalfPage className="half-page">
                    <AnimatedP className="desc" delay={delayTwo}>
                        날씨에 따라 코디를 <br />
                        추천하거나 <br />
                        코디를 추천 받으세요.
                    </AnimatedP>
                    <div className="picture-png left">
                        <AnimatedImg
                            src="img/firstpage/destination.png"
                            alt="reading mobile phone map"
                            delay={delayThree}
                        />
                    </div>
                </HalfPage>
                <HalfPage className="half-page">
                    <TwoPictures className="picture-png right">
                        <AnimatedImg
                            src="img/firstpage/publish_post.png"
                            alt="publishing post"
                            delay={delayFour}
                        />
                        <AnimatedImg
                            src="img/firstpage/among_nature.png"
                            alt="watching tree"
                            delay={delayFour}
                        />
                    </TwoPictures>
                    <AnimatedP className="desc" delay={delayFive}>
                        날씨에 따라 코디를 추천받거나, <br />
                        예보글을 작성하여 <br />
                        적절한 코디를 추천할 수 있어요.
                        <Buttons>
                            <Button onClick={() => history.push("/map")}>
                                시작하기
                            </Button>
                        </Buttons>
                    </AnimatedP>
                </HalfPage>
            </ContentsUnderTitle>
        </TitleAndContents>
    )
}
