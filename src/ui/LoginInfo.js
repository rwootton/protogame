import React from 'react';
import './LoginInfo.css';

const LoginInfo = ({
  user
}) => {

  const onLogOut = () => {
    fetch('/~rakel/protogame/logout', {method: 'POST'}).finally(()=>{
      document.location.reload(true);
    });
  }

  return <div className="loginInfo">
    Logged in as <strong>{user.playerCharacter.name}</strong>

    <div className="actionText" onClick={onLogOut}>logout</div>
  </div>
}

export default LoginInfo;