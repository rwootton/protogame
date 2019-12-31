import React, {useEffect, useState} from 'react';
import { MeshToonMaterial, Mesh, AnimationMixer, Clock } from 'three';
import useAsset from '../common/useAsset'
import { playerAnimations } from './constants/AnimationConstants';

const SCALE = 100;
let session;

const PlayerCharacter = ({
  position, 
  rotation, 
  scene, 
  collisionMap, 
  radius,
  animation,
  gait,
  camera,
  id
}) => {
  const characterFile = useAsset({file: 'assets/elf-test.glb'});
  const [actions, setActions] = useState(null);
  const [playerCharacter, setPlayerCharacter] = useState(null);

  useEffect(()=>{
    fetch(`/~rakel/protogame/api/v1/player-characters/${id}`, {
      headers: {
        'Accept': 'application/json'
      }
    }).then((response)=>response.json()).then((character)=>{
      setPlayerCharacter(character)
    })
  },[])

  useEffect(()=>{
    if(scene && characterFile && playerCharacter) {
      const character = characterFile.scene;
      character.traverse((child)=>{
        if(child instanceof Mesh) {
          if(!playerCharacter[child.name]) {
            child.visible = false;
          }
          else {
            const toonMaterial = new MeshToonMaterial({color: playerCharacter[child.name]})
            toonMaterial.skinning = true;
            child.castShadow = true;
            child.material = toonMaterial;
          }
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
      const walkAction = mixer.clipAction(animations.find(({name})=>name === "walk"));
      const runAction = mixer.clipAction(animations.find(({name})=>name === "run"));
      setActions({idle: action, walk: walkAction, run: runAction});
      action.play();

      const animateLoop = () => {
        const delta = clock.getDelta();
        mixer.update(delta);
        requestAnimationFrame(animateLoop);
      }

      collisionMap.add({z: character.position.z, x: character.position.x, radius})
      scene.add(character);
      animateLoop();
    }

    return () => {
      if(scene && characterFile) {
        scene.remove(characterFile.scene)
      };
    }
  }, [scene, characterFile, playerCharacter])

  useEffect(()=>{
    if(scene && characterFile && (position || gait)) {
      characterFile.scene.position.x = position.x;
      characterFile.scene.position.y = position.y;
      characterFile.scene.position.z = position.z;
      if(camera) {
        camera.position.x = position.x;
        camera.position.z = position.z + 1260;
      }
      session = Date.now();
      let movePredict;
      if(gait) {
        movePredict = (time, localSession) => {
          if(session != localSession) return;
          const heading = rotation.y;
          const current = Date.now();
          const delta = current-time;
          const distance = 800 * gait * delta / 1000;
          characterFile.scene.position.x += Math.sin(heading) * distance;
          characterFile.scene.position.z += Math.cos(heading) * distance;
          if(camera) {
            camera.position.x += Math.sin(heading) * distance;
            camera.position.z += Math.cos(heading) * distance;
          }
          setTimeout(()=>movePredict(current, localSession));
        }
        movePredict(Date.now(), session);
      }
    }

  }, [position])

  useEffect(()=>{
    if(scene && characterFile && rotation) {
      characterFile.scene.rotation.y = rotation.y;
    }
  }, [rotation])

  useEffect(()=>{
    if (scene && characterFile && animation) {
      const animateKey = playerAnimations[animation];
      Object.keys(actions).forEach(key => {
        if (key === animateKey) {
          actions[key].play();
        }
        else {
          actions[key].stop();
        }
      })
    }

  }, [animation])

  return <></>
}

export default PlayerCharacter;