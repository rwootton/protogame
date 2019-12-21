import React, {useEffect} from 'react';
import {PointLight, AmbientLight} from 'three';

const Light = ({scene}) => {

  useEffect(()=>{
    if(!scene) return;
    const pointLight = new PointLight(null, 0.4, 0);
    const ambientLight = new AmbientLight(null, 0.6);
    pointLight.position.y = -500;
    pointLight.rotation.x = 1.4*Math.PI;
    scene.add(pointLight);
    scene.add(ambientLight);
  }, [scene])

  return <></>;
}

export default Light;