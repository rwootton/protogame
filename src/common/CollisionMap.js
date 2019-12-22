class CollisionMap {
  constructor() {
    this.objects = {
    }
  }

  add = ({x, z, radius}) => {
    const key = x+':'+z+':'+radius;
    this.objects[key] = {x, z, radius};
  }

  remove = ({x, z, radius}) => {
    const key = x+':'+z+':'+radius;
    delete this.objects[key];
  }

  isOpen = ({x, z}) => {
    return !Object.values(this.objects).some(
      (obj)=>{
        if((x > obj.x-obj.radius && x < obj.x+obj.radius) && (z > obj.z-obj.radius && z < obj.z+obj.radius)) {
          return true;
        }
        return false;
    })
  }
}

export default CollisionMap;