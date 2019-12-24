import React, {useEffect} from 'react';
import { MeshToonMaterial, Mesh, AnimationMixer, Clock } from 'three';
import useAsset from '../common/useAsset'

const SCALE = 100;

const Npc = ({position, rotation, color, scene, collisionMap}) => {
  const characterFile = useAsset({file: 'assets/elf-test.glb'});
  useEffect(()=>{
    if(scene && characterFile) {
      const character = characterFile.scene;
      const material = new MeshToonMaterial({color})
      material.skinning = true;
      character.traverse((child)=>{
        if(child instanceof Mesh) {
          child.material = material;
          child.castShadow = true;
        }
      })
      if(position) {
        if(position.x) character.position.x = position.x;
        if(position.z) character.position.z = position.z;
      }
      if(rotation) {
        if(rotation.y) character.rotation.y = rotation.y
      }
      character.scale.z = SCALE;
      character.scale.y = SCALE;
      character.scale.x = SCALE;
      const animations = characterFile.animations;
      const mixer = new AnimationMixer(character);
      const clock = new Clock();
      const action = mixer.clipAction(animations.find(({name})=>name === "idle"));
      action.play();

      const animateLoop = () => {
        mixer.update(clock.getDelta());
        requestAnimationFrame(animateLoop);
      }

      collisionMap.add({z: character.position.z, x: character.position.x, radius: 70})
      scene.add(character);
      animateLoop();
    }
  }, [scene, characterFile])

  return <></>
}

export default Npc;