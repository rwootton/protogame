import React, { useMemo, useReducer, useState, useEffect } from 'react';

import CharacterPreview from './CharacterPreview';
import SlotChanger from './SlotChanger';
import Input from './components/Input';
import { Scene, Mesh } from 'three';
import usePlayer from '../character/Player/usePlayer';
import './CharacterCreation.css';

const colorOptions = {
  skin: ['#FFAA86', '#FFE1D4', '#CC896C', '#805644', '#402B22'],
  hair: [null, '#FF3A3A', '#CCA25F', '#FF6B2E', '#FF8787', '#997160', '#594238', '#858CE5', '#88A679'],
  pupils: ['#333333'],
  eyelash: [null, '#333333'],
  eyes: ['#FFFFFF'],
  clothes: [null, '#E8DFC7', '#695C3B', '#B5AE9C', '#69655A', '#4F4C44', '#7785B5', '#B093B5', '#342936', '#59756D', '#A5B593'],
  shirt: [null, '#E8DFC7', '#B5AE9C', '#F5ECD3', '#69655A', '#4F4C44']
}

const reducer = (colorMap, {key, color}) => {
  return {
    ...colorMap,
    [key]: color
  }
}

const CharacterCreation = ({
  width,
  height,
  user,
  onClose
}) => {
  const [colorMap, changeColor] = useReducer(reducer, user && user.playerCharacter || {});
  const [scene, setScene] = useState(null);
  const [player] = usePlayer(scene, colorMap);

  useEffect(()=>{
    setScene(new Scene());
    return ()=>{
      if(scene && scene.dispose) scene.dispose();
    }
  }, []);

  const colorSlots = useMemo(()=>{
    const slots = {};
    player && player.traverse((child) => {
      if(child instanceof Mesh) {
        const baseName = child.name.replace(/\d/g,'');
        slots[baseName] = slots[baseName] || [];
        slots[baseName].push(child.name)
      }
    })
    return slots;
  }, [player]);

  const randomizeColorMap = () => {
    Object.keys(colorSlots).forEach((part) => {
      const variations = colorSlots[part];
      const variation = variations[Math.round(Math.random() * (variations.length - 1))];
      const colors = colorOptions[part] ? colorOptions[part] : colorOptions.clothes;
      const color = colors[Math.round(Math.random() * (colors.length - 1))];
      if(variations.length > 1) {
        variations.forEach((v)=> {
          changeColor({key: v, color: null})
        })
      }
      changeColor({ key: variation, color });
    })
  }

  useEffect(()=>{
    if(Object.keys(colorSlots).length !== Object.keys(colorMap).filter((name)=>!name.includes(/\d/g)).length) {
      randomizeColorMap();
    }
  }, [colorSlots])

  const getCurrentVariation = (part) => {
    if(colorSlots[part].length === 1) return part;
    return Object.keys(colorMap).find((name)=>name.includes(part) && colorMap[name] !== undefined);
  }

  const onChangeColor = (part, newColor) => {
    const variation = getCurrentVariation(part);
    changeColor({key: variation, color: newColor});
  }

  const onChangeVariation = (part, newVariation) => {
    const oldVariation = getCurrentVariation(part);
    changeColor({key: newVariation, color: colorMap[oldVariation]});
    changeColor({key: oldVariation, color: undefined});
  }

  const onSave = () => {
    fetch('/~rakel/protogame/api/v1/player-characters', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(colorMap)
    }).then((response)=>response.json())
    onClose();
  }

  return (
  <div className="characterScreen" style={{width, height}}>
    <CharacterPreview 
      width={width} 
      height={height} 
      player={player}
      scene={scene}
      colorMap={colorMap}
    />
    <div className="controls">
      {Object.keys(colorSlots).map((part)=>{
        const variations = colorSlots[part];
        const variation = getCurrentVariation(part);
        const colors = colorOptions[part] ? colorOptions[part] : colorOptions.clothes;
        return <SlotChanger 
          key={part}
          name={part}
          variations={variations}
          colors={colors}
          currentVariation={variation}
          currentColor={colorMap[variation]}
          onChangeColor={onChangeColor}
          onChangeVariation={onChangeVariation}
        />
      })}
      {"Name"}
      <Input value={colorMap.name} onChange={(value)=>changeColor({key: 'name', color: value})} />
      <div className="buttons">
        <div className="button" onClick={randomizeColorMap}>
          Randomize
        </div>
        <div className="button" onClick={onClose}>
          Cancel
        </div>
        <div className="button" onClick={onSave}>
          Save
        </div>
      </div>
    </div>
  </div>
  )
}

export default CharacterCreation;