import React from 'react';
import Entity from './Entity';

const Cat = (
  props
) => {
  return <Entity 
    scale={200}
    radius={40}
    file={'assets/cat.glb'}
    {...props}
  />
}

export default Cat;