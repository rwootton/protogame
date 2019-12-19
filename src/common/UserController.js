import React, { useEffect } from 'react';

const speed = 4;

const xConstraint = 100000;
const yConstraint = 100000;

const UserController = ({userObject, camera, children, moveAnimation}) => {
  const inputDiv = React.createRef();

  useEffect(()=>{
    inputDiv.current.focus();
  })

  let ySpeed = 0;
  let xSpeed = 0;

  const moveLoop = () => {
    var animate = false;
    if(ySpeed) { 
      userObject.position['z'] -= ySpeed;
      camera.position['z'] -= ySpeed;
      if(Math.abs(userObject.position.y) < yConstraint) animate = true;
    }
    if(xSpeed) {
      userObject.position['x'] += xSpeed;
      camera.position['x'] += xSpeed;
      if(Math.abs(userObject.position.x) < xConstraint) animate = true;
    }

    if(animate) {
      moveAnimation();
      userObject.rotation.y = Math.atan2(xSpeed, -ySpeed);
      requestAnimationFrame(moveLoop)
    }
  }

  const handleKeyDown = ({key}) => {
    if(key.toLowerCase() === 'm') {
      console.log({userObject})
    }
    const moving = ySpeed || xSpeed;
    if(key.toLowerCase() === "w") {
      ySpeed = speed;
    }
    if(key.toLowerCase() === "s") {
      ySpeed = -speed;
    }
    if(key.toLowerCase() === "a") {
      xSpeed = -speed;
    }
    if(key.toLowerCase() === "d") {
      xSpeed = speed;
    }
    if(!moving) moveLoop();
  }

  const handleKeyUp = ({key}) => {
    const moving = ySpeed || xSpeed;
    if(key.toLowerCase() === "w") {
      ySpeed = 0;
    }
    if(key.toLowerCase() === "s") {
      ySpeed = 0;
    }
    if(key.toLowerCase() === "a") {
      xSpeed = 0;
    }
    if(key.toLowerCase() === "d") {
      xSpeed = 0;
    }
    if(!moving) moveLoop();
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