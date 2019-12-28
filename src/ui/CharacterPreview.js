import React, { useEffect, useState } from 'react';
import { 
  PerspectiveCamera, 
  WebGLRenderer, 
  Color 
} from 'three';

import Light from '../common/Light';

const CharacterPreview = ({
  width,
  height,
  player,
  scene
}) => {

  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const mountPoint = React.createRef();

  const animate = () => {
    requestAnimationFrame(animate);
    if(renderer) renderer.render(scene, camera);
  }

  useEffect(()=>{
    if(mountPoint && mountPoint.current && scene) {
      const pCamera = new PerspectiveCamera(45, width/height, 1, 10000);
      pCamera.position.z = 100;
      pCamera.position.y = 500;
      pCamera.rotation.x = 1.8*Math.PI;
      
      setCamera(pCamera);

      scene.background = new Color('#88a677')
      const render = new WebGLRenderer();
      render.setSize(width, height)
      setRenderer(render)
      mountPoint.current.appendChild(render.domElement);
    }

    return () => {
    }
  }, [scene]);

  useEffect(()=>{
    if(renderer && camera) animate();
  }, [renderer, camera])


  return (
    <div 
      ref={mountPoint} 
      style={{ width, height }}>
        <Light scene={scene} />
    </div>
  )
}

export default CharacterPreview;