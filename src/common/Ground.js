import React, { useEffect } from "react"
import {PlaneBufferGeometry, MeshToonMaterial, Mesh, DoubleSide} from 'three';

const Ground = ({scene}) => {

  useEffect(()=>{
    if(!scene) return
    const geometry = new  PlaneBufferGeometry(10000, 10000, 10, 10);
    const material = new MeshToonMaterial({color: '#946046', side: DoubleSide})
    const plane = new Mesh(geometry, material);
    plane.rotation.x = Math.PI/2;
    plane.position.y = -30;
    plane.receiveShadow = true;
    scene.add(plane);
  }, [scene]);

  return <></>;

}

export default Ground;