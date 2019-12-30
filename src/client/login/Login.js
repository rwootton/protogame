import React, { useState } from 'react';
import Input from '../../ui/components/Input';

import './Login.css';

const Login = ({
  onClose
}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    fetch(`/~rakel/protogame/login?username=${userName}&password=${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials: 'include'
    }).then((resp)=>{
      console.log('logged in', resp)
      onClose();
    }, (error)=>{
    })
  }

  return <div className="background">
    <div className="modal">
      <div>
        {"Login"}
      </div>
      <div>
        <span className="inputLabel">
          {"Username"}
        </span>
        <Input
          type="text"
          name="username"
          value={userName}
          onChange={setUserName} />
      </div>
      <div>
        <span className="inputLabel">
          {"Password"}
        </span>
        <Input
          type="password"
          name="password"
          value={password}
          onChange={setPassword} />
      </div>

      <div>
        <span onClick={onSubmit} className="button">{"Login"}</span>
        <span className="button">{"Continue as Guest"}</span>
      </div>
    </div>
  </div>
}

export default Login;