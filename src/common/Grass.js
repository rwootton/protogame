import React from 'react';
import Entity from './Entity';

const Grass = (
    props
  ) => {
    return <Entity 
      scale={90}
      file={'assets/squishgrass.glb'}
      {...props}
    />
}

export default Grass;