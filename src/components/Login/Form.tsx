import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signinHandler } from '../../api/supabase.api';
import { GithubLoginBtn } from './github';
import { GoogleLoginBtn } from './goolge';

const Form = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  //사용자 가입
  const signInWithEmail = async () => {
    try {
      const result = await signinHandler(emailRef.current?.value || '', password);

      console.log('result', result);

      //   const { data, error } = await supabase.auth.signInWithPassword({
      //     email: emailRef.current?.value || '',
      //     password: password,
      //   });

      if (result.error) {
        console.error('로그인중 오류 발생', result.error);
      } else {
        console.log('로그인 성공', result.data);
        // 로그인 성공 후 추가 작업 수행
        alert('로그인완료');
        navigate('/');
      }
    } catch (error) {
      console.error('로그인중 오류 발생', error);
    }
  };

  return (
    <div>
      <h2>Login </h2>
      <label>Email:</label>
      <input type="email" ref={emailRef} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={signInWithEmail}>Sign Up</button>
      <hr />
      <div>
        <GoogleLoginBtn />
        <GithubLoginBtn />
      </div>
    </div>
  );
};

export default Form;
