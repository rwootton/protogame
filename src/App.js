import React, { useState } from 'react';
import World from './common/World';
import AutoSizer from 'react-virtualized-auto-sizer';

function App() {

  return (
    <AutoSizer>
      {({ height, width }) => {
        return <World
          height={height}
          width={width}>
        </World>
      }}
    </AutoSizer>
  );
}

export default App;
