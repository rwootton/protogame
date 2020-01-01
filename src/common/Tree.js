
import React from 'react';
import Entity from './Entity';

const Tree = (props) => {
  return <Entity 
    scale={120}
    radius={100}
    file={'assets/tree.glb'}
    castShadow={false}
    colorMap={{leaves: '#87C771', trunk: '#7A5340'}}
    color={'#87C771'}
    {...props}
  />;
}

export default Tree;