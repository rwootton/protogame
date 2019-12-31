class InteractMap {
  constructor(socket) {
    this.socket = socket;
    this.objects = {
    }
  }

  add = ({x, z, radius, id}) => {
    this.objects[id] = {x, z, radius, id};
  }

  remove = ({id}) => {
    delete this.objects[id];
  }

  getInteractObject = ({x, z}) => {
    const entity = Object.values(this.objects).find(
      (obj)=>{
        return (x > obj.x-obj.radius && x < obj.x+obj.radius) && (z > obj.z-obj.radius && z < obj.z+obj.radius);
    }) || null;
    if(!entity) return null;

    return {...entity, onInteract: ()=>{this.socket.onTake(entity)}};
  }
}

export default InteractMap;