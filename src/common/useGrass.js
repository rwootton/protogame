

import {useEffect, useState} from 'react';
import useAsset from './useAsset';

const file = 'assets/grass.glb';

const scale = 80;

const useGrass = (scene) => {
  const [grass, setGrass] = useState(null);
  const grassFile = useAsset({file});

  useEffect(()=>{
    if(scene && grassFile) {
        const object = grassFile.scene;

        object.position.z = -460;
        object.position.y = -25;
        object.scale.z = scale;
        object.scale.y = scale;
        object.scale.x = scale;
        setGrass(object)
        scene.add(object);
    };

    return ()=>{
      if(grassFile && grassFile.dispose) grassFile.dispose();
    }
  }, [scene, grassFile])

  return grass;
}

export default useGrass;