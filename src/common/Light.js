import React, {useEffect} from 'react';
import {PointLight, AmbientLight} from 'three';

const Light = ({scene}) => {

  useEffect(()=>{
    if(!scene) return;
    const pointLight = new PointLight('#FFFFFF', 0.8);
    const ambientLight = new AmbientLight(null, 0.3);
    //  X, Y, Z
    pointLight.position.set(-600, 5000, 300);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 50000;
    pointLight.shadow.radius = 2;
    pointLight.shadow.mapSize.width = 4096;
    pointLight.shadow.mapSize.height = 4096;
    scene.add(pointLight);
    scene.add(ambientLight);
  }, [scene])

  return <></>;
}

export default Light;