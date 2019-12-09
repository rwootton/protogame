import React, {useEffect, useState} from 'react';
import { AnimationMixer, LoopRepeat, LoopPingPong } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const usePlayer = (scene) => {
  const [player, setPlayer] = useState(null);
  const [loader, setLoader] = useState(null);
  const [mixer, setMixer] = useState(null);

  useEffect(()=>{
    if(scene) {
      const load = new GLTFLoader();
      setLoader(load);
      load.load('assets/jeffu/scene.gltf', (loaded)=>{
        const object = loaded.scene.children[0];
        const animations = loaded.animations;
        const mixer = new AnimationMixer(object)
        setMixer(mixer);
        const action = mixer.clipAction(animations[0]);

        action.play();
        object.position.z = -460;
        setPlayer(object)
        scene.add(object);
      });
    }

    return ()=>{
      if(loader) loader.dispose();
      if(player) player.dispose();
      if(mixer) player.dispose();
    }
  }, [scene])

  return [player, mixer];
}

export default usePlayer;