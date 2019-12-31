import React, { useEffect, useState, useReducer } from 'react';
import { 
  Scene, 
  WebGLRenderer, 
  PerspectiveCamera, 
  Clock,
  PCFSoftShadowMap,
  Color
} from 'three';
import UserController from './UserController';
import Light from './Light';
import Field from './Field'
import Ground from './Ground'
import CollisionMap from './CollisionMap';
import InteractMap from './InteractMap';
import useSocket  from '../client/NivelSocket';
import LoginInfo from '../ui/LoginInfo';
import { GidTypeMap } from './constants/GidTypes';

const serverEntityReducer = (state, entity) => {
  return {...state, [entity.id]: entity};
}

const World = ({ height, width, user }) => {
  const mountPoint = React.createRef();

  const [collisionMap, setCollisionMap] = useState(null);
  const [interactMap, setInteractMap] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);

  const [serverEntities, updateServerEntity] = useReducer(serverEntityReducer, {});

  const onTick = ({entity}) => {
    if(entity){
      updateServerEntity(entity);
    }
  }

  const socket = useSocket({onTick, user});


  const animate = () => {
    requestAnimationFrame(animate);
    if(renderer) renderer.render(scene, camera);
  }

  useEffect(() => {
    setCollisionMap(new CollisionMap());
    setInteractMap(new InteractMap(socket));
    const scene = new Scene();
    scene.background = new Color('#8C8CD0')
    setScene(scene);
    setCamera(new PerspectiveCamera(45, width / height, 1, 10000));
    setRenderer(new WebGLRenderer())
    return () => {
      if (mountPoint && mountPoint.current) mountPoint.current.innerHTML = "";
      if (scene) scene.dispose();
      if (renderer) renderer.dispose();
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
    animate();
  }, [renderer, camera])

  return (
    <UserController
      socket={socket}
      collisionMap={collisionMap}
      interactMap={interactMap}
      scene={scene}
      userObject={serverEntities[user.playerCharacter.id]}
      onUpdateUser={updateServerEntity}
      camera={camera}>
      <LoginInfo user={user} />
      <div ref={mountPoint} style={{ width, height, overflow: 'hidden' }}>
        <Ground scene={scene} />
        <Light scene={scene} />
        {serverEntities && Object.values(serverEntities).map(({type, id, posX, posY, posZ, colRad, facing, animation, gait, collidable, takeable}, index)=>{
          const EntityType = GidTypeMap[type];
          if(EntityType) {
            return <EntityType 
              id={id}
              collisionMap={collisionMap}
              key={id+''+index}
              scene={scene}
              position={{x: posX, y: posY, z: posZ}} 
              rotation={{y: facing}}
              radius={collidable && colRad || 0}
              animation={animation}
              gait={gait}
              camera={id===user.playerCharacter.id && camera}
              interactMap={takeable && interactMap}
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
      </div>
    </UserController>
  )
}

export default World;