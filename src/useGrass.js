import { useEffect, useState } from "react"
import {PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide} from 'three';

const useGround = (scene) => {
  const [ground, setGround] = useState(null)

  useEffect(()=>{
    if(!scene) return
    const geometry = new  PlaneBufferGeometry(10000, 10000, 10, 10);
    const material = new MeshBasicMaterial({color: '#966635', side: DoubleSide})
    const plane = new Mesh(geometry, material);
    plane.rotation.x = Math.PI/2;
    plane.position.y = -30;
    setGround(plane);
    scene.add(plane);
  }, [scene]);

  return ground;

}

export default useGround;