import React from 'react'
import Grass from './Grass';

const Field = ({scene, diameter, count, startPosition}) => {
  const colors = ['#b2db9c', '#88a677', '#87c771']
  return <>
    {Array.from(Array(count).keys()).map((index)=>{
      const zOffset = Math.random()*diameter*2-diameter;
      const xMax = Math.sqrt(Math.abs(Math.pow(diameter, 2) - Math.pow(zOffset,2)));
      const xOffset = Math.random()*xMax*2-xMax;


      return <Grass
      key={index}
      scene={scene}
      color={colors[Math.round(Math.random()*2)]}
      position={{
        z: startPosition.z + zOffset,
        x: startPosition.x + xOffset,
      }}
      rotation={{
        z: Math.random(Math.PI)
      }}/>
    })}
  </>
}

export default Field;