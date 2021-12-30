import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Map from './pages/postView/Map';
import Home from './pages/postView/Home';
import BookMark from './pages/postView/BookMark';
import Header from './components/common/Header';
import MenuBar from './components/common/MenuBar';
import UserInfo from './pages/user/UserInfo';
import More from './pages/user/More';
import MyPage from './pages/user/MyPage';
import Login from './pages/user/Login';
import PasswordEdit from './pages/user/PasswordEdit';
import SignUp from './pages/user/SignUp';
import MyPost from './pages/user/MyPost';
import Write from './pages/postView/Write';
import PostRead from './pages/postView/PostRead';
import ReadBookMarkPost from './pages/postView/ReadBookMarkPost';
import PostEdit from './pages/postView/PostEdit';
import FirstPage from './pages/etc/FirstPage';
import Loading from './pages/etc/Loading';
import EditUserInfo from './pages/user/EditUserInfo';
import { changeIsLogin, changeUser } from './actions/index';
import GlobalStyle from './components/GlobalStyle';

let url = process.env.REACT_APP_LOCAL_HTTP_SERVER;

export default function App() {
  const dispatch = useDispatch();

  const isInput = true;
  const { isLogin } = useSelector((state) => state.itemReducer);
  useEffect(() => {
    if (localStorage.getItem('ATOKEN')) {
      axios({
        url: url + '/users/auth',
        method: 'get',
        headers: {
          authorization: `token ${JSON.parse(localStorage.getItem('ATOKEN'))}`,
        },
      }).then((res) => {
        dispatch(changeUser(res.data.data));
        dispatch(changeIsLogin(res.data.login));
      });
    }
  }, [isLogin, dispatch]);

  return (
    <>
      <GlobalStyle />
      <Header isInput={isInput} />
      <Switch>
        <Route exact path='/map'>
          <Map />
        </Route>
        <Route exact path='/home'>
          <Home />
        </Route>
        <Route exact path='/bookmark'>
          <BookMark />
        </Route>
        <Route exact path='/userinfo'>
          <UserInfo />
        </Route>
        <Route exact path='/edituserinfo'>
          <EditUserInfo />
        </Route>
        <Route exact path='/more'>
          <More />
        </Route>
        <Route exact path='/mypage'>
          <MyPage />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
        <Route exact path='/signup'>
          <SignUp />
        </Route>
        <Route exact path='/editpassword'>
          <PasswordEdit />
        </Route>
        <Route exact path='/write'>
          <Write />
        </Route>
        <Route exact path='/mypost'>
          <MyPost />
        </Route>
        <Route exact path='/postread'>
          <PostRead />
        </Route>
        <Route exact path='/bookmarkpost'>
          <ReadBookMarkPost />
        </Route>
        <Route exact path='/postedit'>
          <PostEdit />
        </Route>
        <Route exact path='/first'>
          <FirstPage />
        </Route>
        <Route exact path='/loading'>
          <Loading />
        </Route>

        <Route exact path='/writeorlogin'>
          <Redirect to={isLogin ? '/write' : '/login'} />
        </Route>
        <Route exact path='/bookmarkorlogin'>
          <Redirect to={isLogin ? '/bookmark' : '/login'} />
        </Route>
        <Route exact path='/homeorlogin'>
          <Redirect to={isLogin ? '/home' : '/login'} />
        </Route>
        <Route exact path='/moreoruserinfo'>
          <Redirect to={isLogin ? '/userinfo' : '/more'} />
        </Route>
        <Route exact path='/editpost'>
          <PostEdit />
        </Route>
        <Route exact path='/'>
          <Redirect to='/first' />
        </Route>
      </Switch>
      <MenuBar />
    </>
  );
}
