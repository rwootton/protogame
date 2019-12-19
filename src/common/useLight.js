import React, {useEffect, useState} from 'react';
import {PointLight, AmbientLight} from 'three';

const useLight = (scene) => {
  const [light, setLight] = useState(null);

  useEffect(()=>{
    if(!scene) return;
    const newLight = new PointLight('#c9c9c9', 0.7, 0);
    const otherLight = new AmbientLight('#c9c9c9', 0.9);
    newLight.position.y = 600;
    otherLight.position.y = 1000;
    otherLight.rotation.x = 1.8*Math.PI;
    scene.add(newLight);
    scene.add(otherLight);
    setLight(newLight);
  }, [scene])

  return light;
}

export default useLight;