import React, {useEffect, useState} from 'react';
import useAsset from './useAsset';
import { MeshToonMaterial, Mesh } from 'three'

const Entity = ({
  file,
  scene,
  position,
  rotation,
  color,
  collisionMap,
  scale = 1,
  radius
}) => {
  const entityFile = useAsset({file});

  useEffect(()=>{
    if (scene && entityFile) {
      const object = entityFile.scene;
      if (color) {
        const toonMaterial = new MeshToonMaterial({ color });
        object.traverse((child) => {
          if (child instanceof Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = toonMaterial;
          }
        })
      }
      else {
        const toonMaterial = new MeshToonMaterial();
        object.traverse((child) => {
          if (child instanceof Mesh) {
            child.castShadow = true;
            toonMaterial.skinning = true;
            toonMaterial.map = child.material.map;
            toonMaterial.textures = child.material.textures;
            toonMaterial.images = child.material.images;
            child.material = toonMaterial;
          }
        })
      }
      if (position) {
        if (position.x) object.position.x = position.x;
        if (position.y) object.position.y = position.y;
        if (position.z) object.position.z = position.z;
      }
      if (rotation) {
        if (rotation.y) object.rotation.y = rotation.y;
        if (rotation.x) object.rotation.x = rotation.x;
        if (rotation.z) object.rotation.z = rotation.z;
      }
      if (collisionMap) {
        collisionMap.add({ x: position.x, z: position.z, radius: radius })
      }

      object.scale.z = scale;
      object.scale.y = scale;
      object.scale.x = scale;
      scene.add(object);
    };

    return () => {
      if (entityFile && entityFile.dispose) entityFile.dispose();
      if (collisionMap) collisionMap.remove({ x: position.x, z: position.z, radius: radius })
    }
  }, [scene, entityFile])

  return <></>
}

export default Entity;