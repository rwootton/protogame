import React from 'react'
import Grass from './Grass';

const Field = ({scene, radius, count, startPosition}) => {
  const colors = ['#b2db9c', '#88a677', '#87c771']
  return <>
    {Array.from(Array(count).keys()).map((index)=>{
      const zOffset = Math.random()*radius*2-radius;
      const xMax = Math.sqrt(Math.abs(Math.pow(radius, 2) - Math.pow(zOffset,2)));
      const xOffset = Math.random()*xMax*2-xMax;


      return <Grass
      key={index}
      scene={scene}
      color={colors[Math.round(Math.random()*2)]}
      position={{
        z: startPosition.z + zOffset,
        x: startPosition.x + xOffset,
        y: -40
      }}
      rotation={{
        y: -Math.PI/2 + Math.random()
      }}/>
    })}
  </>
}

export default Field;