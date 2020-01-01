import React, {useEffect, useState} from 'react';
import useAsset from './useAsset';
import { MeshToonMaterial, Mesh, AnimationMixer, Clock } from 'three'

const Entity = ({
  file,
  scene,
  position,
  rotation,
  color,
  collisionMap,
  scale = 1,
  radius,
  colorMap,
  castShadow
}) => {
  const entityFile = useAsset({file});
  let mixer;
  let object;

  useEffect(() => {
    if (scene && entityFile) {
      object = entityFile.scene;
      object.traverse((child) => {
        if (child instanceof Mesh) {
          if (color || (colorMap && colorMap[child.name])) {
            const toonMaterial = new MeshToonMaterial({ color: colorMap && colorMap[child.name] || color });
            child.castShadow = castShadow;
            child.receiveShadow = true;
            child.material = toonMaterial;
          }
          else {
            const toonMaterial = new MeshToonMaterial();
            child.castShadow = castShadow;
            toonMaterial.skinning = true;
            toonMaterial.map = child.material.map;
            toonMaterial.textures = child.material.textures;
            toonMaterial.images = child.material.images;
            child.material = toonMaterial;
          }
        }
      })
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
      if(entityFile.animations && entityFile.animations.length) {
        mixer = new AnimationMixer(object);
        const clock = new Clock();
        const action = mixer.clipAction(entityFile.animations[0]);
        action.play();

        const animateLoop = () => {
          mixer.update(clock.getDelta())
          requestAnimationFrame(animateLoop);
        }
        animateLoop();
      }

      object.scale.z = scale;
      object.scale.y = scale;
      object.scale.x = scale;
      scene.add(object);
    };

    return () => {
      if(scene) scene.remove(object);
      if (entityFile && entityFile.dispose) entityFile.dispose();
      if (object && object.dispose) object.dispose();
      if (collisionMap) collisionMap.remove({ x: position.x, z: position.z, radius: radius })
      if(mixer && mixer.dispose) mixer.dispose();
    }
  }, [scene, entityFile])

  return <></>
}

export default Entity;