
import React, {useEffect, useState} from 'react';
import useAsset from './useAsset';
import { MeshToonMaterial, Mesh } from 'three'

const file = 'assets/tree.glb';

const scale = 40;

const Tree = ({scene}) => {
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

        object.position.z = -600;
        object.position.x = -200;
        object.rotation.y = Math.PI/2 + 0.8;
        object.scale.z = scale;
        object.scale.y = scale;
        object.scale.x = scale;
        scene.add(object);
    };

    return ()=>{
      if(treeFile && treeFile.dispose) treeFile.dispose();
    }
  }, [scene, treeFile])

  return <></>;
}

export default Tree;