import styled from "styled-components"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faHome, faHeart, faMapMarkerAlt, faPencilAlt, faUserAlt } from "@fortawesome/free-solid-svg-icons"

const PostListContainer = styled.button`
    background-color: #d5d5d5;
`

const PostPhoto = styled.img`
    width: 90px;
    height: 50px;
    // display: flex;
    // flex-direction: column;
`
const PostPhotoDivideContents = styled.button`
    padding: 0.5rem;
    margin: 0.5rem;
    font-size: 0.5rem;
    display: flex;
    flex-direction: row;
`

export default function PostListView() {
    return (
        <>
            <PostListContainer>
                <PostPhotoDivideContents>
                    <PostPhoto src="./img/img0.png" />
                    <div>
                        <div>10/23 충무로역 날씨예보</div>
                        <div>김코딩(동네 캐스터),</div>
                        <div>
                            오늘은 둥근 해가 떳다. 실내에서 볼때는 날씨가 좋아서
                            옷을 얇게 입고 외출!. 그러나 매우 찬바람이 불었다.
                            옷은 두껍게 입길 강추드립니다!!
                        </div>
                    </div>
                </PostPhotoDivideContents>
            </PostListContainer>
        </>
    )
}
