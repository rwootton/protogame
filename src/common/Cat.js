import React from 'react';
import Entity from './Entity';

const Cat = (
  props
) => {
  return <Entity 
    scale={300}
    radius={60}
    file={'assets/cat.glb'}
    {...props}
  />
}

export default Cat;