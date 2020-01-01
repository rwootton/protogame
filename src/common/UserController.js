import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';

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
  camera, 
  children, 
  collisionMap,
  interactMap,
  onUpdateUser,
  socket
}) => {

  const inputDiv = React.createRef();
  inputDiv && inputDiv.current &&  inputDiv.current.focus();

  const handleKeyDown = ({key}) => {
    if(key.toLowerCase() === 'shift') {
      sprint = true;
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
      const availableInteraction = interactMap.getInteractObject({x: userObject.posX, y: userObject.posy, z: userObject.posZ});
      if(availableInteraction) {
        availableInteraction.onInteract();
      }
    }
    sendMoveUpdate();
  }

  const handleKeyUp = ({key}) => {
    if(key.toLowerCase() === 'shift') {
      sprint = false;
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
    sendMoveUpdate();
  }

  const sendMoveUpdate = () =>  {
    gait = zSpeed || xSpeed ? (sprint ? 1 : 0.25) : 0;
    animation = zSpeed || xSpeed ? (sprint ? 3 : 2) : 1;
    if(gait) rotation = Math.atan2(xSpeed, zSpeed);
    const facing = rotation;
    if(lastGait !== gait || lastFacing !== facing) {
      lastGait = gait;
      lastFacing = facing;
      socket.onMove({gait, facing});
      // onUpdateUser({...userObject, gait, facing, heading: facing});
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