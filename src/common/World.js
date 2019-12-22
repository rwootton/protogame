import React, { useEffect, useState } from 'react';
import { 
  Scene, 
  WebGLRenderer, 
  PerspectiveCamera, 
  Clock,
  PCFSoftShadowMap
} from 'three';
import usePlayer from '../character/Player/usePlayer';
import UserController from './UserController';
import Light from './Light';
import Tree from './Tree';
import Field from './Field'
import Ground from './Ground'

const World = ({ height, width }) => {
  const mountPoint = React.createRef();

  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [clock, setClock] = useState(null);

  const [player, mixer, walkAction] = usePlayer(scene);

  const animate = () => {
    requestAnimationFrame(animate);
    if(mixer) mixer.update(clock.getDelta());
    if(renderer) renderer.render(scene, camera);
  }

  useEffect(()=> {
    setScene(new Scene());
    setCamera(new PerspectiveCamera(45, width / height, 1, 10000));
    setRenderer(new WebGLRenderer())
    setClock(new Clock());
    return () => {
      if(mountPoint && mountPoint.current) mountPoint.current.innerHTML = "";
      if(scene) scene.dispose();
      if(renderer) renderer.dispose();
    }
  }, [])

  useEffect(() => {
    if(camera) camera.aspect = width / height;
    if(renderer) renderer.setSize(width, height);
  }, [width, height])

  useEffect(()=> {
    if(!renderer) return;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
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

  return (
    <UserController
      scene={scene}
      userObject={player}
      walkAction={walkAction}
      mixer={mixer}
      camera={camera}>
      <div ref={mountPoint} style={{ width, height }}>
        <Tree scene={scene} />
        <Ground scene={scene} />
        <Light scene={scene} />
        <Field
          scene={scene}
          diameter={600}
          count={1000}
          startPosition={{ x: -200, z: -600 }}
        />
      </div>
    </UserController>
  )
}

export default World;