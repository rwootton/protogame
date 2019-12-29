import {useEffect, useState} from 'react';
import {
  ServerMsgDto, 
  ClientMsgDto, 
  ErrorDto, 
  EntityStatusListDto, 
  EventDto, 
  EventAnimateDto, 
  EventGaitDto, 
  EntityDto
} from '../proto/nivel_pb';

let socket;

const useSocket = ({onEntitySpawn, onEntityMove}) => {
  useEffect(()=>{
    socket = new WebSocket("wss://www.randalloveson.com:443/~rakel/protogame/levelone");
    socket.onopen = e=>{
      console.log('open', e)
    }
    socket.onmessage = e=>{
      e.data.arrayBuffer().then((theData)=>{
        const size = new DataView(theData, 0, 4).getUint32(0, false);
        const message = theData.slice(4, 4+size);
        const worldState = ServerMsgDto.deserializeBinary(message).toObject();
        // console.log(JSON.stringify(worldState))
      })
    }
    socket.onclose = e=>{
      console.log('close', e);
    }
  }, []);

  const onMove = () => {

  }

  const onSpawn = ({position}) => {
    
    const entity = new EntityDto();
    entity.setPosx(position.x);
    entity.setPosy(position.y);
    entity.setPosz(position.z);
    entity.setCollisionradius(10);
    entity.setGid(1)
    entity.setSpeed(1)
    entity.setHeading(0)
    entity.setFacing(0)
    entity.setGait(0)
    entity.setAnimationstart(0)
    entity.setAnimation(0)
    entity.setCollisionmaska(0)
    entity.setCollisionmaskb(0)
    const event = new EventDto();
    event.setSpawn(entity);
    event.setTick(Date.now()>>3)
    const msg = new ClientMsgDto();
    msg.setEvent(event);

    const binary = msg.serializeBinary();
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);
    dataView.setUint32(0, binary.length, false);
    socket.send(dataView);
    socket.send(binary);
  }

  return {
    onMove,
    onSpawn
  };
}

export default useSocket;