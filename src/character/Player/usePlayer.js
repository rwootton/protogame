import {useEffect, useState} from 'react';
import { AnimationMixer } from 'three';
import useAsset from '../../common/useAsset';

const file = 'assets/lofi-polly.glb';

const usePlayer = (scene) => {
  const playerFile = useAsset({file});
  const [player, setPlayer] = useState(null);
  const [mixer, setMixer] = useState(null);

  useEffect(()=>{
    if(scene && playerFile) {
        const object = playerFile.scene;
        const animations = playerFile.animations;
        const mixer = new AnimationMixer(object)
        setMixer(mixer);
        const action = mixer.clipAction(animations[0]);

        action.play();
        object.position.z = -460;
        object.scale.z = 50;
        object.scale.y = 50;
        object.scale.x = 50;
        setPlayer(object)
        scene.add(object);
    }

    return ()=>{
      if(mixer && mixer.dispose) mixer.dispose();
    }
  }, [scene, playerFile])

  return [player, mixer];
}

export default usePlayer;