import React, { useEffect} from 'react';
import Entity from './Entity';

const Tulip = (props) => {
  const { scene, interactMap } = props;

  useEffect(()=>{
      if(scene && interactMap) {
        const {x, y, z} = props.position;
        const {id} = props;
        interactMap.add({x, y, z, radius: 200, id});
        console.log({interactMap})
      }
  }, [scene, interactMap])

  return <Entity 
    scale={15}
    radius={20}
    file={'assets/tulip.glb'}
    castShadow={false}
    {...props}
  />
}

export default Tulip;