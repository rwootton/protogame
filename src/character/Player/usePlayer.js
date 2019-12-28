import {useEffect, useState, Children} from 'react';
import { AnimationMixer, MeshToonMaterial, Mesh, Color } from 'three';
import useAsset from '../../common/useAsset';

const file = 'assets/elf-test.glb';
const scale = 100;

const usePlayer = (scene, colorMap) => {
  const playerFile = useAsset({file});
  const [player, setPlayer] = useState(null);
  const [mixer, setMixer] = useState(null);
  const [walkAction, setWalkAction] = useState(null);
  const [runAction, setRunAction] = useState(null);

  useEffect(()=> {
    if(player && colorMap) {
      player.traverse((child)=>{
        if(child instanceof Mesh) {
          if(!colorMap[child.name]) {
            child.visible = false;
          }
          else {
            child.visible = true;
            child.material.color = new Color(colorMap[child.name]);
          }
        }
      })
    }
  }, [colorMap])

  useEffect(() => {
    if (scene && playerFile) {
      const object = playerFile.scene;
      object.traverse((child)=>{
        if(child instanceof Mesh) {
            const toonMaterial = new MeshToonMaterial({color: colorMap[child.name]})
            if(!colorMap[child.name]) {
              child.visible = false;
            }
            toonMaterial.skinning = true;
            child.castShadow = true;
            child.material = toonMaterial;
        }
      })
      const animations = playerFile.animations;
      if(animations && animations.length) {
        const mixer = new AnimationMixer(object)
        setMixer(mixer);
        const action = mixer.clipAction(animations.find(({name})=>name === "idle"));
        const walkAction = mixer.clipAction(animations.find(({name})=>name === "walk"));
        const runAction = mixer.clipAction(animations.find(({name})=>name === "run"));
        setWalkAction(walkAction);
        setRunAction(runAction);

        action.play();
      }
      else {
        console.warn('no animations found for player')
      }

      object.position.z = -460;
      object.position.y = -20;
      object.scale.z = scale;
      object.scale.y = scale;
      object.scale.x = scale;

      setPlayer(object)
      scene.add(object);
    }

    return ()=>{
      if(mixer && mixer.dispose) mixer.dispose();
    }
  }, [scene, playerFile])

  return [player, mixer, walkAction, runAction];
}

export default usePlayer;