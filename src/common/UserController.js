import React, { useEffect } from 'react';

const speed = 200;

const UserController = ({userObject, camera, children, walkAction, collisionMap}) => {
  const inputDiv = React.createRef();

  useEffect(()=>{
    if(userObject) {
      inputDiv.current.focus();
      moveLoop(Date.now());
      requestAnimationFrame(animate);
    }
  }, [userObject])

  let zSpeed = 0;
  let xSpeed = 0;

  const animate = () => {
    inputDiv.current.focus();
    if(zSpeed || xSpeed) {
      walkAction.play();
      userObject.rotation.y = Math.atan2(xSpeed, zSpeed);
    }
    else walkAction.stop();
    requestAnimationFrame(animate);
  }

  const moveLoop = (lastTime) => {
    const current = Date.now();
    const delta = current - lastTime;
    const newOffset = {z: 0, x: 0};
    if(zSpeed) { 
      newOffset.z = (delta / 1000) * (xSpeed ? zSpeed * 1/Math.sqrt(2) : zSpeed);
    }
    if(xSpeed) {
      newOffset.x = (delta / 1000) * (zSpeed ? xSpeed * 1/Math.sqrt(2) : xSpeed);
    }

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
    else {
      // zSpeed = 0;
      // xSpeed = 0;
      walkAction.stop();
    }
    setTimeout(()=>moveLoop(current))
  }

  const handleKeyDown = ({key}) => {
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
  }

  const handleKeyUp = ({key}) => {
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