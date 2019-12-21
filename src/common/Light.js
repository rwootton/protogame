import React, {useEffect} from 'react';
import {PointLight, AmbientLight} from 'three';

const Light = ({scene}) => {

  useEffect(()=>{
    if(!scene) return;
    const pointLight = new PointLight('#f2ddce', 0.5);
    const ambientLight = new AmbientLight(null, 0.8);
    pointLight.position.set(100, 1000, -460);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 20;
    pointLight.shadow.camera.far = 6000;
    scene.add(pointLight);
    scene.add(ambientLight);
  }, [scene])

  return <></>;
}

export default Light;