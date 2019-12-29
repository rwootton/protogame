import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { playerAnimations } from '../character/constants/AnimationConstants';

const speed = 800;

let sprint = false;

let zSpeed = 0;
let xSpeed = 0;

let gait = 0;
let rotation = 0;
let animation = null;

let lastAnimation = null;
let lastGait = 0;
let lastFacing = 0;

const UserController = ({
  userObject, 
  actions,
  camera, 
  children, 
  collisionMap,
  interactMap,
  socket
}) => {

  const inputDiv = React.createRef();
  inputDiv && inputDiv.current &&  inputDiv.current.focus();

  useEffect(()=>{
    if(userObject) {
      moveLoop(Date.now());
      requestAnimationFrame(animate);
    }

    return () => {
    }
  }, [userObject])

  const animate = () => {
    if(xSpeed || zSpeed) {
      rotation = Math.atan2(xSpeed, zSpeed);
      userObject.rotation.y = rotation;
    }
    const currentAnimation = playerAnimations[animation];
    Object.keys(actions).forEach(key=>{
      if(currentAnimation === key) {
        actions[key].play();
      }
      else {
        actions[key].stop();
      }
    }) 
    requestAnimationFrame(animate);
  }

  const moveLoop = (lastTime) => {
    const current = Date.now();
    gait = zSpeed || xSpeed ? (sprint ? 1 : 0.25) : 0;
    animation = zSpeed || xSpeed ? (sprint ? 3 : 2) : 1;
    if (gait) {
      const delta = current - lastTime;
      const distance = speed * gait * delta / 1000;
      const newOffset = { z: 0, x: 0 };
      newOffset.x = Math.sin(rotation) * distance;
      newOffset.z = Math.cos(rotation) * distance;

      const newPosition = {
        x: userObject.position.x + newOffset.x,
        z: userObject.position.z + newOffset.z
      };

      if (collisionMap.isOpen(newPosition)) {
        userObject.position.z += newOffset.z;
        userObject.position.x += newOffset.x;
        camera.position.x += newOffset.x;
        camera.position.z += newOffset.z;
      }
      else {
        gait = 0;
        actions.walk.stop();
      }
    }
    else {
      gait = 0;
      actions.walk.stop();
    }
    sendMoveUpdate();
    setTimeout(() => moveLoop(current), 20)
  }

  const handleKeyDown = ({key}) => {
    if(key.toLowerCase() === 'shift') {
      sprint = true;
      actions.walk.stop();
    }
    if(key.toLowerCase() === 'm') {
      console.log({userObject})
    }
    if(key.toLowerCase() === "w") {
      zSpeed = -speed;
    }
    if(key.toLowerCase() === "s") {
      zSpeed = speed;
    }
    if(key.toLowerCase() === "a") {
      xSpeed = -speed;
    }
    if(key.toLowerCase() === "d") {
      xSpeed = speed;
    }
    if(key.toLowerCase() === "e") {
      const availableInteraction = interactMap.getInteractObject(userObject.position);
      if(availableInteraction) {
        availableInteraction.onInteract();
      }
    }
  }

  const handleKeyUp = ({key}) => {
    if(key.toLowerCase() === 'shift') {
      sprint = false;
      actions.run.stop();
    }
    if(key.toLowerCase() === "w" && zSpeed === -speed) {
      zSpeed = 0;
    }
    if(key.toLowerCase() === "s" && zSpeed === speed) {
      zSpeed = 0;
    }
    if(key.toLowerCase() === "a" && xSpeed === -speed) {
      xSpeed = 0;
    }
    if(key.toLowerCase() === "d" && xSpeed === speed) {
      xSpeed = 0;
    }
  }

  const sendMoveUpdate = () =>  {
    const facing = rotation;
    if(lastGait !== gait || lastFacing !== facing) {
      lastGait = gait;
      lastFacing = facing;
      socket.onMove({gait, facing});
    }

    if(lastAnimation !== animation) {
      socket.onAnimate({animation})
      lastAnimation = animation;
    }
  }

  return <div 
    tabIndex={0} 
    ref={inputDiv} 
    onKeyUp={handleKeyUp} 
    onKeyDown={handleKeyDown}>
    {children}
  </div>
}

export default UserController;