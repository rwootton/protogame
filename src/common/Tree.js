
import React from 'react';
import Entity from './Entity';

const Tree = (props) => {
  return <Entity 
    scale={40}
    radius={80}
    file={'assets/tree.glb'}
    {...props}
  />;
}

export default Tree;