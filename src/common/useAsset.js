import React, {useEffect, useState} from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const useAsset = ({file}) => {
  const [asset, setAsset] = useState(null);
  const [loader, setLoader] = useState(null);

  useEffect(() => {
    const load = new GLTFLoader();
    setLoader(load);
    load.load(file, (loaded) => {
      setAsset(loaded)
    }, (progress) => {
    }, (error) => {
      console.error(`failed to load`, error)
    });

    return () => {
      if (loader && loader.dispose) loader.dispose();
      if (asset && asset.dispose) asset.dispose();
    }
  }, [file])

  return asset;
}

export default useAsset;