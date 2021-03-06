import styled from 'styled-components';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';

const Outer = styled.div`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100vw;
  min-height: var(--mobile-page-height);
  padding: 3rem auto;
  background-color: var(--page-bg-color);

  @media ${(props) => props.theme.viewportMin10} {
    flex-direction: row;
    min-height: var(--desktop-page-height);
    padding: 2rem;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: ${(props) => (props.round ? '50%' : null)};
  background-color: #fec0cb;
  font-size: 1.25rem;
  padding: ${(props) => (props.round ? '.5rem .5rem' : '.5rem 2rem')};
  margin: ${(props) => (props.round ? '.5rem' : '1rem')};
  border: 0;
  outline: 0;
  color: white;

  &:hover {
    background-color: #ff7f9f;
  }

  & > img {
    height: 1.5rem;
    width: 1.5rem;
  }
`;

const Button2 = styled.input`
  width: 50vw;
  min-width: 100px;
  max-width: 300px;
  margin: 1rem;
  padding: 0.8rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #fec0cb;

  &:hover {
    background-color: #ff7f9f;
  }

  > span {
    margin: 0.25rem;
  }
`;

const PictureSection = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  height: inherit;

  @media ${(props) => props.theme.viewportMin10} {
    justify-content: center;
    width: 40vw;
  }
`;

const DesktopRight = styled.section`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media ${(props) => props.theme.viewportMin10} {
    justify-content: space-around;
    width: 40vw;
  }
`;

const WriteText = styled.div`
  width: 70vw;
  min-width: 250px;
  height: ${(props) => (props.small ? '3rem' : '5vh')};
  text-align: center;
  vertical-align: center;
  line-height: 1.2rem;
  font-size: 1.2rem;
  margin: 1.5rem;
  padding: 1rem;

  @media ${(props) => props.theme.viewportMin10} {
    width: ${(props) => (props.small ? '35vw' : '40vw')};
    max-width: ${(props) => (props.small ? '500px' : '800px')};
  }
`;

const PhotoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  min-width: 300px;
  min-height: 300px;
  background-color: #ececec;
  border: 1px solid #b5b5b5;
  object-fit: cover;
`;

const PhotoBox2 = styled.img`
  min-width: 300px;
  width: 30vh;
  height: auto;
`;

const Button3 = styled.button`
  width: 50vw;
  min-width: 100px;
  max-width: 300px;
  margin: 0.5rem;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #fec0cb;
  border-radius: 1rem;

  &:hover {
    background-color: #ff7f9f;
  }

  > span {
    margin: 0.25rem;
  }
`;

const ValidationListBox = styled.ul`
  list-style: none;
  padding: 0 1.5rem;
  font-size: 1rem;

  li {
    height: 1.2rem;
    padding: 0 1.5rem;
    color: var(--font-validation-negative);
  }
`;

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function Write() {
  const history = useHistory();
  const [userRoadAddress, setRoadUserAddress] = useState('??? ??????????????? ??????????????????.');
  const [photo, setPhoto] = useState('');
  const [uploadedImg, setUploadedImg] = useState({
    fileName: 'blankPost.png',
    filePath: `${url}/img/blankPost.png`,
  });

  const submitButtonHandler = (e) => {
    const token = JSON.parse(localStorage.getItem('ATOKEN'));
    axios({
      url: url + '/edituserinfo',
      method: 'put',
      data: {
        location: userRoadAddress,
        user_photo: uploadedImg.filePath,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
      withCredentials: true,
    })
      .then((res) => {
        alert('?????? ??????, ???????????? ??? ??????????????????:)');
        history.push('/home');
      })
      .catch((err) => err);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('img', photo);
    axios
      .post(url + '/post/photo', formData, {
        'Content-Type': 'multipart/form-data',
        withCredentials: true,
      })
      .then((res) => {
        const { fileName } = res.data;
        setUploadedImg({
          fileName,
          filePath: `${url}/img/${fileName}`,
        });
        alert('????????? ??????????????? ????????? ???????????????!');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addFile = (e) => {
    setPhoto(e.target.files[0]);
  };

  function handleComplete(complevent) {
    setRoadUserAddress(complevent.roadAddress);
  }

  return (
    <Outer className='writePage'>
      <PictureSection className='pictureUploadSection writePageLeft' onSubmit={onSubmit}>
        <WriteText>????????? ??????</WriteText>
        <PhotoBox>{uploadedImg ? <PhotoBox2 src={uploadedImg.filePath} alt='icon' /> : <div></div>}</PhotoBox>
        <Button2 type='file' className='uploadButton' onChange={addFile} round />
        <Button3 type='submit'>?????????</Button3>
      </PictureSection>

      <DesktopRight className='writePageRight'>
        <WriteText>?????????</WriteText>
        <DaumPostcode onComplete={handleComplete} />
        <ValidationListBox className='pwValidationList'>{userRoadAddress}</ValidationListBox>
        <Button className='submitButton' onClick={submitButtonHandler}>
          ??????
        </Button>
      </DesktopRight>
    </Outer>
  );
}
