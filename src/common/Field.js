import React from 'react'
import Grass from './Grass';

const Field = ({scene, diameter, max, min, startPosition}) => {
  return <>
    {Array.from(Array((Math.round(Math.random()*(max-min))+min)).keys()).map((index)=>{
      return <Grass
      key={index}
      scene={scene}
      position={{
        z: startPosition.z + Math.random()*diameter*(Math.random() > .5 ? -1 : 1),
        x: startPosition.x + Math.random()*diameter*(Math.random() > .5 ? -1 : 1),
      }}
      rotation={{
        z: Math.random(Math.PI)
      }}/>
    })}
  </>
}

export default Field;