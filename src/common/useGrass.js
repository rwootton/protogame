

import {useEffect, useState} from 'react';
import { AnimationMixer, MeshToonMaterial, Mesh } from 'three';
import useAsset from './useAsset';

const file = 'assets/squishgrass.glb';

const scale = 80;

const useGrass = (scene, objectProps = {}) => {
  const [grass, setGrass] = useState(null);
  const grassFile = useAsset({file});

  useEffect(()=>{
    if(scene && grassFile) {
      const material = new MeshToonMaterial({color: '#948ba3'})
        const object = grassFile.scene;
        object.traverse((child)=>{
          if(child instanceof Mesh) {
            child.material = material;
          }
        })

        Object.keys(objectProps).forEach((key)=>{
          object[key] = objectProps[key];
        })

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