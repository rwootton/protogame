import React, { useState, useEffect } from 'react';
import World from './common/World';
import AutoSizer from 'react-virtualized-auto-sizer';
import CharacterCreation from './ui/CharacterCreation';

const App = () => {
  const localStorage = window.localStorage;
  const [colorMap, setColorMap] = useState(null);

  useEffect(()=>{
    getColorMap();
  }, [])

  const getColorMap = () => {
    try {
      if(localStorage.getItem('colorMap')) {
        setColorMap(JSON.parse(localStorage.getItem('colorMap')));
      }
    }
    catch(e) {
      console.log('error', e)
    }
  }

  return (
    <AutoSizer>
      {({ height, width }) => {
        if(!colorMap) {
          return <CharacterCreation 
            height={height} 
            width={width} 
            onClose={getColorMap} />
        }
        return <World
          colorMap={colorMap}
          height={height}
          width={width}>
        </World>
      }}
    </AutoSizer>
  );
}

export default App;
