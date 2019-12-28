import React, { useEffect, useState } from 'react';
import { Scene, PerspectiveCamera } from 'three';

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
    if(mountPoint && mountPoint.current) {
      const pCamera = new PerspectiveCamera(45, width/height, 1, 1000);
      pCamera.position.z = 800;
      pCamera.position.y = 1000;
      pCamera.rotation.x = 1.8*Math.PI;
      setCamera(pCamera);
      const render = new WebGLRenderer();
      render.setSize(width, height)
      setRenderer(render)
      mountPoint.current.appendChild(renderer.domElement);
      animate();
    }

    return () => {
    }
  }, [mountPoint, player]);


  return (
    <div 
      ref={mountPoint} 
      style={{ width, height }}>
    </div>
  )
}

export default CharacterPreview;