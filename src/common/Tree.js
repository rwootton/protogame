
import React, {useEffect, useState} from 'react';
import useAsset from './useAsset';
import { MeshToonMaterial, Mesh } from 'three'

const file = 'assets/tree.glb';

const SCALE = 40;
const RADIUS = 80;

const Tree = ({
  scene, 
  position, 
  rotation, 
  color, 
  collisionMap
}) => {
  const treeFile = useAsset({file});

  useEffect(()=>{
    if(scene && treeFile) {
        const toonMaterial = new MeshToonMaterial({color: '#7A5340'});
        const object = treeFile.scene;
        object.traverse((child)=>{
          if(child instanceof Mesh) {
            child.castShadow = true;
            child.material = toonMaterial;
          }
        })
        if(position) {
          if(position.x) object.position.x = position.x;
          if(position.z) object.position.z = position.z;
        }
        if(rotation) {
          if(rotation.y) object.rotation.y = rotation.y;
        }
        if(collisionMap) {
          collisionMap.add({x: position.x, z: position.z, radius: RADIUS})
        }

        object.scale.z = SCALE;
        object.scale.y = SCALE;
        object.scale.x = SCALE;
        scene.add(object);
    };

    return ()=>{
      if(treeFile && treeFile.dispose) treeFile.dispose();
      if(collisionMap) collisionMap.remove({x: position.x, z: position.z, radius: RADIUS})
    }
  }, [scene, treeFile])

  return <></>;
}

export default Tree;