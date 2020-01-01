
import React from 'react';
import Entity from './Entity';

const Tree = (props) => {
  return <Entity 
    scale={90}
    radius={100}
    file={'assets/tree.glb'}
    castShadow={false}
    color={'#87C771'}
    colorMap={{trunk: '#7A5340'}}
    {...props}
  />;
}

export default Tree;