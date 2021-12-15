import styled from "styled-components"
import { useHistory } from "react-router-dom"

// const InputCheckbox = styled.input.attrs({
//   type: 'checkbox',
//   checked: true,
//  })`
//   border-radius: 5px;
//   color: red;
//  `;

export const Contents = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;

    @media screen and (min-width: 1081px) {
        flex-direction: row;
    }
`

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

    @media screen and (min-width: 1081px) {
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
`

export const AnimatedP = styled.p`
    animation: fade-in ease-in 1 backwards;
    animation-duration: ${(props) => props.duration || "1.5s"};
    animation-delay: ${(props) => props.delay || null};
`

export const AnimatedImg = styled.img`
    animation: fade-in ease-in 1 backwards;
    animation-duration: ${(props) => props.duration || ".5s"};
    animation-delay: ${(props) => props.delay || null};
`
const Button = styled.button`
// width: 140px;
// height: 45px;
// font-size: 11px;
// border:3px solid pink;
font-family: 'IBM Plex Sans KR', sans-serif;

font-size: ${(props) => (props.isText ? "1.6rem" : "1.6rem")};
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
    // height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`
export default function One({ delayOne, delayTwo }) {
    const history = useHistory()

    return (
        <Contents className={["landingPagePart", "one"]}>
            <HalfPage className="half-page">
                <AnimatedP className="desc">
                    일기 예보가 <br />
                    믿음직스럽지 못하시다구요?
                    <br />
                </AnimatedP>
                <div className="picture-png left">
                    <AnimatedImg
                        src="img/firstpage/phone-and-human.png"
                        alt="human with phone"
                    />
                </div>

                <Buttons>
                    <Button onClick={() => history.push("/map")}>
                        시작하기
                    </Button>
                </Buttons>
            </HalfPage>

            <HalfPage className="half-page">
                <AnimatedP className="desc" delay={delayOne}>
                    동네 주민이 올린 하늘의 사진을 <br />
                    실시간으로 확인할 수 있어요.
                    <br />
                </AnimatedP>
                <AnimatedP className="desc" delay={delayOne}>
                    여러분도 하늘사진을 공유하고 <br />
                    동네 날씨예보관이 되어 보세요!
                </AnimatedP>
                <div className="picture-png right">
                    <AnimatedImg
                        src="img/firstpage/town.png"
                        alt="street"
                        delay={delayTwo}
                    />
                </div>
            </HalfPage>
        </Contents>
    )
}
