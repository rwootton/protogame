import React, { useEffect, useReducer } from 'react';
import Tulip from './Tulip';

const reducer = (tulips, removeId) => {
  return tulips.filter(({id})=>(id !== removeId));
}
 
const PickFlowers = ({
  scene, 
  interactMap
}) => {
  // persistent state coming soon*
  const [tulips, dispatch] = useReducer(reducer, [
    {x: -140, z: -1500, y: 20, rotate: 0.33, id: 0}, 
    {x: -180, z: -800, y: 20, rotate: 1.5, id: 1}, 
    {x: -200, z: -700, y: 20, rotate: 2, id: 2}, 
    {x: -500, z: -400, y: 20, rotate: 0.76, id: 3},
    {x: 20, z: 20, y: 20, rotate: 0.66, id: 4}
  ]);

  useEffect(()=>{
    if(scene && interactMap) {
      tulips.forEach(({x, z, y, id})=>{
        interactMap.add({x, y, z, radius: 30, onInteract: ()=>dispatch(id)})
      });
    }

    return () => {
    }
  }, [scene, interactMap])

  return <>
    {tulips.map(({x, z, y, id, rotate})=>{
      return <Tulip 
        key={id}
        scene={scene}
        rotation={{y: rotate * Math.PI}}
        position={{x, z, y}} 
      />
    })}
  </>
}

export default PickFlowers;