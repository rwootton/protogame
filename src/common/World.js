import React, { useEffect, useState } from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera, Clock } from 'three';
import usePlayer from '../character/Player/usePlayer';
import UserController from '../common/UserController';

const World = ({ height, width, children }) => {
  const mountPoint = React.createRef();

  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [clock, setClock] = useState(null);

  const [player, mixer] = usePlayer(scene);


  const animate = () => {
    requestAnimationFrame(animate);
    // if(mixer) mixer.update(clock.getDelta());
    if(renderer) renderer.render(scene, camera);
  }

  useEffect(() => {
    setScene(new Scene());
    setCamera(new PerspectiveCamera(45, width / height, 1, 2000));
    setRenderer(new WebGLRenderer())
    setClock(new Clock());

    return () => {
      if(mountPoint && mountPoint.current) mountPoint.current.innerHTML = "";
      if(scene) scene.dispose();
      if(renderer) renderer.dispose();
      if(player) player.dispose();
    }
  }, [width, height])

  useEffect(()=> {
    if(!renderer) return;
    mountPoint.current.appendChild(renderer.domElement);
    camera.position.z = 0;
    camera.position.y = 600;
    camera.rotation.x = 1.8*Math.PI;
    renderer.setSize(width, height);
  }, [renderer, camera])

  useEffect(()=>{
    if(mixer) {
      animate();
    }

  }, [mixer]);

  return <UserController userObject={player} moveAnimation={()=>{mixer.update(clock.getDelta())}}>
    <div ref={mountPoint} style={{ width, height }}>
      {children}
    </div>
  </UserController>
}

export default World;