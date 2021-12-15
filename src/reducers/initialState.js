export const initialState = {
    //만드신 변수는 어떤 변수인지 설명 부탁드려요-hoon
    isLogin: false, //로그인상태 -hoon
    genderToggle: 1, //기본값 1, 회원가입시에 젠더 토글 클릭시 남=1 여=2으로 변함-hoon
    curLocation: { lat: "", lon: "" }, //현재 위치 변수-hoon
    userInfo: {}, //회원 로그인시 정보 저장할 변수-hoon
    weatherFilter: "", //헤더에서 날씨 필터에서 선택된 날씨-hoon
    mapPage: false, //헤더에서 날씨필터 없애기용 변수-hoon
    curRoom: null, //메신져에서 방입장시 사용할 변수-hoon
    newMsgSection: [
        // {
        //     user_id: "",
        //     receiver_id: "",
        //     roomName: "",
        // },
    ], //메신져기능에서 새로운 메시지를 렌더링할 변수
    searchWord: "",
    selectWord: "",
    editPassword: false,
    start: 0, //북마크 페이지네이션
    end: 10,
    current: 1,
    item: [], //기상청 데이터
    postInfo: {}, //post 정보
    readPostId: "", // 북마크나 지도 모달에서 클릭한 게시물의 아이디
    homePost: [], // Home의 최근 게시물
}
