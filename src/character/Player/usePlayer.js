import {useEffect, useState} from 'react';
import { AnimationMixer, MeshToonMaterial, Mesh } from 'three';
import useAsset from '../../common/useAsset';

const file = 'assets/elf-test.glb';
const scale = 100;

const usePlayer = (scene) => {
  const playerFile = useAsset({file});
  const [player, setPlayer] = useState(null);
  const [mixer, setMixer] = useState(null);
  const [walkAction, setWalkAction] = useState(null);

  useEffect(() => {
    if (scene && playerFile) {
      const object = playerFile.scene;
      object.traverse((child)=>{
        if(child instanceof Mesh) {
          const toonMaterial = new MeshToonMaterial({color: '#ebc0ae'})
          toonMaterial.skinning = true;
          child.material = toonMaterial;
        }
      })
      const animations = playerFile.animations;
      if(animations && animations.length) {
        const mixer = new AnimationMixer(object)
        setMixer(mixer);
        const action = mixer.clipAction(animations.find(({name})=>name === "idle"));
        const walkAction = mixer.clipAction(animations.find(({name})=>name === "walk"));
        setWalkAction(walkAction);

        action.play();
      }
      else {
        console.warn('no animations found for player')
      }

      object.position.z = -460;
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

  return [player, mixer, walkAction];
}

export default usePlayer;