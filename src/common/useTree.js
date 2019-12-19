
import {useEffect, useState} from 'react';
import useAsset from './useAsset';

const file = 'assets/tree.glb';

const scale = 40;

const useTree = (scene) => {
  const [tree, setTree] = useState(null);
  const treeFile = useAsset({file});

  useEffect(()=>{
    if(scene && treeFile) {
        const object = treeFile.scene;

        object.position.z = -600;
        object.position.x = -200;
        object.rotation.y = Math.PI/2;
        object.scale.z = scale;
        object.scale.y = scale;
        object.scale.x = scale;
        setTree(object)
        scene.add(object);
    };

    return ()=>{
      if(treeFile && treeFile.dispose) treeFile.dispose();
    }
  }, [scene, treeFile])

  return tree;
}

export default useTree;