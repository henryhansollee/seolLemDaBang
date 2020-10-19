import React, { useState } from 'react';
import HeaderComp from '../../components/base/HeaderComp';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const LoginPage = ({ history }) => {
  const [ username, setUsername ] = useState('');             // 이름
  const [ email, setEmail ] = useState('');                   // 이메일
  const [ password, setPassword ] = useState('');             // 비밀번호
  
  // 토큰
  const [cookies, setCookie] = useCookies(['access-token']);  // 토큰

  const setUsernameText = e => {setUsername(e.target.value)}; // 이름
  const setEmailText = e => {setEmail(e.target.value)};       // 이메일
  const setPasswordText = e => {setPassword(e.target.value)}; // 비밀번호

  const sendLoginData = e => {
    e.preventDefault()
    const loginData = {username, email, password}
    console.log(loginData, '로그인 정보')
    axios.post('/rest-auth/login/', loginData)
      .then((response) => {
        console.log('로그인 성공')
        setCookie('access-token', response.data.key)
        history.push('/main')
      })
      .catch((error) => console.log(error))
  };

  return (
    <div>
      <HeaderComp />
      <h1>로그인</h1>
      <div className="w-25">
        <form onSubmit={sendLoginData} className="d-flex flex-column">
          <input placeholder="이름" username={username} onChange={setUsernameText} />
          <input placeholder="이메일" email={email} onChange={setEmailText} />
          <input placeholder="비밀번호" password={password} onChange={setPasswordText} />
          <button type="submit">로그인</button>
        </form>
      </div>
      <small>아직 회원이 아니신가요?</small>
      <a href="/signup">회원가입</a>
    </div>
  );
};

export default LoginPage;