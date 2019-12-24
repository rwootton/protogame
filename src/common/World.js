import React, { useEffect, useState } from 'react';
import { 
  Scene, 
  WebGLRenderer, 
  PerspectiveCamera, 
  Clock,
  PCFSoftShadowMap
} from 'three';
import usePlayer from '../character/Player/usePlayer';
import Npc from '../character/Npc';
import UserController from './UserController';
import Light from './Light';
import Tree from './Tree';
import Field from './Field'
import Ground from './Ground'
import CollisionMap from './CollisionMap';

const World = ({ height, width }) => {
  const mountPoint = React.createRef();

  const [collisionMap, setCollisionMap] = useState(null);
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
    setCollisionMap(new CollisionMap());
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
    if(renderer) renderer.setSize(width, height);
    if(camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
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
      collisionMap={collisionMap}
      scene={scene}
      userObject={player}
      walkAction={walkAction}
      mixer={mixer}
      camera={camera}>
      <div ref={mountPoint} style={{ width, height, overflow: 'hidden' }}>
        <Npc 
          position={{ x:-520, z: -800 }}
          rotation={Math.PI*1.25}
          color={'#FF5B55'}
          scene={scene}
          mixer={mixer}
          collisionMap={collisionMap}
        />
        <Tree 
          collisionMap={collisionMap}
          position={{ x: -200, z: -600 }}
          rotation={{ y: Math.PI/2 + 0.8 }}
          scene={scene} 
        />
        <Tree 
          collisionMap={collisionMap}
          position={{ x: -600, z: -900 }}
          rotation={{ y: Math.PI/2 + 0.4 }}
          scene={scene} 
        />
        <Ground scene={scene} />
        <Light scene={scene} />
        <Field
          scene={scene}
          radius={600}
          count={200}
          startPosition={{ x: -200, z: -600 }}
        />
        <Field
          scene={scene}
          radius={500}
          count={100}
          startPosition={{ x: 600, z: -1300 }}
        />
      </div>
    </UserController>
  )
}

export default World;