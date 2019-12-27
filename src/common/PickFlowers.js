import React, { useEffect, useReducer } from 'react';
import Tulip from './Tulip';

const reducer = (tulips, {index}) => {
  return tulips.filter((t, i)=>(i !== index));
}
 
const PickFlowers = ({
  scene, 
  interactMap
}) => {
  // persistent state coming soon*
  const [tulips, dispatch] = useReducer(reducer, [
    {x: -140, z: -1500, y: 20, rotate: 0.33}, 
    {x: -180, z: -800, y: 20, rotate: 1.5}, 
    {x: -200, z: -700, y: 20, rotate: 1.5}, 
    {x: -500, z: -400, y: 20, rotate: 0.76},
    {x: 20, z: 20, y: 20, rotate: 1.76}
  ]);

  const onInteract = (index) => {
    dispatch({index});
  }

  useEffect(()=>{
    if(scene && interactMap) {
      tulips.forEach(({x, z, y}, index)=>{
        interactMap.add({x, y, z, radius: 40, onInteract: ()=>onInteract(index)})
      });
    }

    return () => {
    }
  }, [scene, interactMap])


  return <>
    {tulips.map(({x, z, y})=>{
      return <Tulip 
        scene={scene}
        position={{x, z, y}} 
      />
    })}
  </>
}

export default PickFlowers;