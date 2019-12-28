import React, { useMemo, useReducer } from 'react';

import CharacterPreview from './CharacterPreview';
import { Scene } from 'three';
import usePlayer from '../character/Player/usePlayer';
import 'CharacterCreation.css';

const reducer = (colorMap, {key, color}) => {
  return {
    ...colorMap,
    [key]: color
  }
}

const CharacterCreation = ({
  width,
  height
}) => {
  const [player] = usePlayer(scene, colorMap);
  const [colorMap, dispatch] = useReducer(reducer, {});

  const colorSlots = useMemo(()=>{
    const slots = [];
    player.traverse((child) => {
      if(child instanceof Mesh) {
        slots.push(child.name);
      }
    })
    return slots;
  }, [player])

  return (
  <div className="characterScreen">
    <CharacterPreview 
      width={width/2} 
      height={height} 
      player={player}
      colorMap={colorMap}
    />
    <div>
      {colorSlots.map((part)=>{
        return <div>{part}</div>
      })}
    </div>
  </div>
  )
}

export default CharacterCreation;