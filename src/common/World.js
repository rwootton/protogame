import React, { useEffect, useState } from 'react';
import { 
  Scene, 
  WebGLRenderer, 
  PerspectiveCamera, 
  Clock,
  PCFSoftShadowMap,
  Color
} from 'three';
import usePlayer from '../character/Player/usePlayer';
import Npc from '../character/Npc';
import UserController from './UserController';
import Light from './Light';
import Tree from './Tree';
import Field from './Field'
import Ground from './Ground'
import Cat from './Cat';
import PickFlowers from './PickFlowers';
import CollisionMap from './CollisionMap';
import InteractMap from './InteractMap';
import WorldState from '../proto/nivel_pb';

const World = ({ height, width }) => {
  const mountPoint = React.createRef();

  const [collisionMap, setCollisionMap] = useState(null);
  const [interactMap, setInteractMap] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [clock, setClock] = useState(null);

  const [player, mixer, walkAction, runAction] = usePlayer(scene);

  const animate = () => {
    requestAnimationFrame(animate);
    if(mixer) mixer.update(clock.getDelta());
    if(renderer) renderer.render(scene, camera);
  }

  useEffect(()=> {
    setCollisionMap(new CollisionMap());
    setInteractMap(new InteractMap());
    const scene = new Scene();
    scene.background = new Color('#8C8CD0')
    setScene(scene);
    setCamera(new PerspectiveCamera(45, width / height, 1, 10000));
    setRenderer(new WebGLRenderer())
    setClock(new Clock());
    const socket = new WebSocket("wss://www.randalloveson.com:443/~rakel/protogame/levelone");
    console.log({socket})
    socket.onopen = e=>{
      console.log('open', e)
    }
    socket.onmessage = e=>{
      e.data.arrayBuffer().then((theData)=>{
          const worldState = WorldState.world.deserializeBinary(theData).toObject();
          console.log(JSON.stringify(worldState))
      })
    }
    socket.onclose = e=>{
      console.log('close', e);
    }
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
      interactMap={interactMap}
      scene={scene}
      userObject={player}
      walkAction={walkAction}
      runAction={runAction}
      mixer={mixer}
      camera={camera}>
      <div ref={mountPoint} style={{ width, height, overflow: 'hidden' }}>
        <Cat 
          collisionMap={collisionMap}
          castShadow={true}
          scene={scene}
          rotation={{ y: Math.PI/2}}
          position={{ x: -240, z: -1500, y: -20 }}
        />
        <Tree 
          collisionMap={collisionMap}
          position={{ x: 300, z: -600, y: 80 }}
          rotation={{ y: Math.PI }}
          scene={scene} 
        />
        <Tree 
          collisionMap={collisionMap}
          position={{ x: -600, z: -900, y: 20 }}
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
        <PickFlowers
          scene={scene}
          interactMap={interactMap}
        />
      </div>
    </UserController>
  )
}

export default World;