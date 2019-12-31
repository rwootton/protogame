import React, { useState, useEffect } from 'react';
import World from './common/World';
import AutoSizer from 'react-virtualized-auto-sizer';
import CharacterCreation from './ui/CharacterCreation';
import Login from './client/login/Login';
import Spinner from './ui/components/Spinner'
import { getUser } from './client/User';

const App = () => {
  const localStorage = window.localStorage;
  const user = getUser();
  const [loggedIn, setLoggedIn] = useState(!!user.id);
  const [loading, setLoading] = useState(!!user.fetching);

  if(user.fetching) {
    user.fetching.then((resp)=>{
      if(user.id) {
        setLoading(false);
        setLoggedIn(true);
      }
      else {
        setLoading(false);
      }
    }, ()=>{
      setLoading(false);
    })
  }

  if(loading) return <Spinner />
  if (!loggedIn) return (
    <Login 
      onClose={() => {
        setLoading(true);
        user.retrieveUser().then(()=>{
          setLoading(false);
          setLoggedIn(true)
        });
      }}
  />)

  return (
    <AutoSizer>
      {({ height, width }) => {
        if(!user.playerCharacter) {
          return <CharacterCreation 
            height={height} 
            width={width} 
            onClose={()=>{}} />
        }
        return <World
          user={user}
          height={height}
          width={width}>
        </World>
      }}
    </AutoSizer>
  );
}

export default App;
