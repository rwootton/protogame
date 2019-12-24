import React, { useEffect } from 'react';
import { MeshDepthMaterial, Mesh, MeshToonMaterial } from 'three';
import useAsset from './useAsset';

const SCALE = 90;

const Grass = ({scene, position, rotation, color}) => {
  const grassAsset = useAsset({file: 'assets/squishgrass.glb'});

  useEffect(()=>{
    if(!grassAsset) return;
    const material = new MeshToonMaterial({color})
    const object = grassAsset.scene;
    object.traverse((child)=>{
      if(child instanceof Mesh) {
        child.receiveShadow = true;
        child.material = material;
      }
    })
    object.position.y = -25;
    if(position) {
      if(position.x) object.position.x = position.x;
      if(position.z) object.position.z = position.z;
      if(position.y) object.position.y = position.y;
    }
    if(rotation) {
      if(rotation.y) object.rotation.y = rotation.y;
    }

    object.scale.z = SCALE;
    object.scale.x = SCALE;
    object.scale.y = SCALE;

    scene.add(object);

    return ()=>{
      grassAsset && grassAsset.dispose && grassAsset.dispose();
    }
  }, [grassAsset]);


  return <></>
}

export default Grass;