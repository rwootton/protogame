import React, { useEffect, useState } from 'react';
import { 
  Scene, 
  WebGLRenderer, 
  PerspectiveCamera, 
  Clock
} from 'three';
import usePlayer from '../character/Player/usePlayer';
import UserController from './UserController';
import useLight from './useLight';
import useTree from './useTree';
import useGrass from './useGrass';
import useGround from './useGround';

const World = ({ height, width, children }) => {
  const mountPoint = React.createRef();

  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [clock, setClock] = useState(null);

  const [player, mixer] = usePlayer(scene);
  useLight(scene);
  useTree(scene);
  useGround(scene);
  useGrass(scene);


  const animate = () => {
    requestAnimationFrame(animate);
    if(mixer) mixer.update(clock.getDelta());
    if(renderer) renderer.render(scene, camera);
  }

  useEffect(() => {
    setScene(new Scene());
    setCamera(new PerspectiveCamera(45, width / height, 1, 10000));
    setRenderer(new WebGLRenderer())
    setClock(new Clock());

    return () => {
      if(mountPoint && mountPoint.current) mountPoint.current.innerHTML = "";
      if(scene) scene.dispose();
      if(renderer) renderer.dispose();
    }
  }, [width, height])

  useEffect(()=> {
    if(!renderer) return;
    mountPoint.current.appendChild(renderer.domElement);
    camera.position.z = 800;
    camera.position.y = 1000;
    camera.rotation.x = 1.8*Math.PI;
    renderer.setSize(width, height);
  }, [renderer, camera])

  useEffect(()=>{
    if(mixer) {
      animate();
    }

  }, [mixer]);

  return <UserController userObject={player} camera={camera} moveAnimation={()=>{mixer.update(clock.getDelta())}}>
    <div ref={mountPoint} style={{ width, height }}>
      {children}
    </div>
  </UserController>
}

export default World;