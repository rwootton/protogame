class InteractMap {
  constructor() {
    this.objects = {
    }
  }

  add = ({x, z, radius, onInteract}) => {
    const key = x+':'+z+':'+radius;
    this.objects[key] = {x, z, radius, onInteract};
  }

  remove = ({x, z, radius}) => {
    const key = x+':'+z+':'+radius;
    delete this.objects[key];
  }

  getInteractObject = ({x, z}) => {
    return Object.values(this.objects).find(
      (obj)=>{
        return (x > obj.x-obj.radius && x < obj.x+obj.radius) && (z > obj.z-obj.radius && z < obj.z+obj.radius);
    }) || null;
  }
}

export default InteractMap;