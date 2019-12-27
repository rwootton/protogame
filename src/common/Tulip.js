import React from 'react';
import Entity from './Entity';

const Tulip = (props) => {
  return <Entity 
    scale={15}
    radius={20}
    file={'assets/tulip.glb'}
    castShadow={false}
    {...props}
  />
}

export default Tulip;