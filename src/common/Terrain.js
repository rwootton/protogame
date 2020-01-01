import React from 'react';
import Entity from './Entity';

const Terrain = (props) => {
  return <Entity 
    file={'assets/terrain.glb'}
    color={'#946046'}
    scale={100}
    {...props}
  />
}

export default Terrain;