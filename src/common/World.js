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
import UserController from './UserController';
import Light from './Light';
import Field from './Field'
import Ground from './Ground'
import PickFlowers from './PickFlowers';
import CollisionMap from './CollisionMap';
import InteractMap from './InteractMap';
import useSocket  from '../client/NivelSocket';
import Npc from '../character/Npc';
import LoginInfo from '../ui/LoginInfo';
import { GidTypeMap } from './constants/GidTypes';

const World = ({ height, width, user }) => {
  const mountPoint = React.createRef();

  const [collisionMap, setCollisionMap] = useState(null);
  const [interactMap, setInteractMap] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [clock, setClock] = useState(null);

  const [serverEntities, setServerEntities] = useState([]);

  const [player, mixer, actions] = usePlayer(scene, user.playerCharacter);

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

  const onTick = (entities) => {
    if(entities) {
      setServerEntities(entities)
    }
  }

  const socket = useSocket({onTick});

  return (
    <UserController
      socket={socket}
      collisionMap={collisionMap}
      interactMap={interactMap}
      scene={scene}
      userObject={player}
      actions={actions}
      mixer={mixer}
      camera={camera}>
      <LoginInfo user={user} />
      <div ref={mountPoint} style={{ width, height, overflow: 'hidden' }}>
        <Ground scene={scene} />
        <Light scene={scene} />
        {serverEntities && serverEntities.map(({gid, posX, posY, posZ, collisionRadius, facing, animation, gait}, index)=>{
          const EntityType = GidTypeMap[gid];
          if(EntityType) {
            return <EntityType 
              collisionMap={collisionMap}
              key={gid+''+index}
              scene={scene}
              position={{x: posX, y: posY, z: posZ}} 
              rotation={{y: facing}}
              radius={collisionRadius}
            />
          }
          if(gid != socket.gid) {
            return <Npc 
              key={gid}
              collisionMap={collisionMap}
              scene={scene}
              position={{x: posX, y: posY, z: posZ}} 
              animation={animation}
              rotation={{y: facing}}
              color={'#99ccee'}
              radius={0}
              gait={gait}
            />
          }
          return null;
        })}
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