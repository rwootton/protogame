import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';

const speed = 200;

let sprint = false;

let zSpeed = 0;
let xSpeed = 0;

const UserController = ({
  userObject, 
  camera, 
  children, 
  walkAction, 
  runAction, 
  collisionMap,
  interactMap,
  idleAction
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
    if(zSpeed || xSpeed) {
      sprint ? runAction.play() : walkAction.play();
      if(sprint) idleAction.stop();
      userObject.rotation.y = Math.atan2(xSpeed, zSpeed);
    }
    else {
      walkAction.stop();
      runAction.stop();
      idleAction.play();
    }
    requestAnimationFrame(animate);
  }

  const moveLoop = (lastTime) => {
    const current = Date.now();
    const delta = current - lastTime;
    const newOffset = {z: 0, x: 0};
    if(zSpeed) { 
      newOffset.z = (delta / 1000) * (xSpeed ? zSpeed * 1/Math.sqrt(2) : zSpeed) * (sprint ? 4 : 1);
    }
    if(xSpeed) {
      newOffset.x = (delta / 1000) * (zSpeed ? xSpeed * 1/Math.sqrt(2) : xSpeed) * (sprint ? 4 : 1);
    }

    if(zSpeed || xSpeed) {
      const newPosition = {
        x: userObject.position.x + newOffset.x, 
        z: userObject.position.z + newOffset.z
      };

      if(collisionMap.isOpen(newPosition)) {
        userObject.position.z += newOffset.z;
        userObject.position.x += newOffset.x;
        camera.position.x += newOffset.x;
        camera.position.z += newOffset.z;
      }
    }
    else {
      walkAction.stop();
    }
    setTimeout(()=>moveLoop(current), 20)
  }

  const handleKeyDown = ({key}) => {
    if(key.toLowerCase() === 'shift') {
      sprint = true;
      walkAction.stop();
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
      runAction.stop();
    }
    if(key.toLowerCase() === "w") {
      zSpeed = 0;
    }
    if(key.toLowerCase() === "s") {
      zSpeed = 0;
    }
    if(key.toLowerCase() === "a") {
      xSpeed = 0;
    }
    if(key.toLowerCase() === "d") {
      xSpeed = 0;
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