import React, {useEffect} from 'react';
import {DirectionalLight, AmbientLight, HemisphereLight} from 'three';

const Light = ({scene}) => {

  useEffect(()=>{
    if(!scene) return;
    const pointLight = new DirectionalLight(0xffffff, 0.8);
    const ambientLight = new HemisphereLight(0xffffff, 0x444444);
    ambientLight.position.set(0,30,-300);
    //  X, Y, Z
    pointLight.position.set(120,800,1000);
    pointLight.castShadow = true;
    pointLight.shadow.camera.top = 3000;
    pointLight.shadow.camera.bottom = -3000;
    pointLight.shadow.camera.left = -3000;
    pointLight.shadow.camera.right = 3000;
    pointLight.shadow.camera.near = 10;
    pointLight.shadow.camera.far = 9000;
    pointLight.shadow.radius = 2;
    pointLight.shadow.mapSize.width = 4096;
    pointLight.shadow.mapSize.height = 4096;
    scene.add(pointLight);
    scene.add(ambientLight);
  }, [scene])

  return <></>;
}

export default Light;