import {useEffect, useState} from 'react';
import {
  ServerMsgDto, 
  ClientMsgDto, 
  ControlDto,
  ControlGaitDto,
  ControlAnimateDto
} from '../proto/nivel_pb';

let gid;
let socket;
 
const useSocket = ({onTick}) => {
  useEffect(()=>{
    socket = new WebSocket("wss://www.randalloveson.com:443/~rakel/protogame/levelone");
    socket.onopen = e=>{
      console.log('open', e)
    }
    socket.onmessage = e=>{
      e && e.data && e.data.arrayBuffer().then((theData)=>{
        const size = new DataView(theData, 0, 4).getUint32(0, false);
        const binary = theData.slice(4, 4+size);
        const message = ServerMsgDto.deserializeBinary(binary).toObject();
        if(message.youre) {
          gid = message.youre.gid;
        }
        else if(message.entityList) {
          onTick(message.entityList.entitiesList);
        }
      })
    }
    socket.onclose = e=>{
      console.log('close', e);
    }
  }, []);

  const onMove = ({gait, facing}) => {
    const control = new ControlDto();
    const tick = Math.round(new Date().getTime() / 8) - 12;
    control.setTick(tick)
    const gaitDto = new ControlGaitDto();
    gaitDto.setHeading(facing);
    gaitDto.setFacing(facing);
    gaitDto.setGait(gait);
    control.setGait(gaitDto);
    const message = new ClientMsgDto();
    message.setControl(control);

    const binary = message.serializeBinary();
    const size = binary.length;
    const sizeArray = new ArrayBuffer(4);
    const dataView = new DataView(sizeArray);
    dataView.setUint32(0, size, false);
    socket.send(dataView);
    socket.send(binary);
  }

  const onAnimate = ({animation}) => {
    const control = new ControlDto();
    const tick = Math.round(new Date().getTime() / 8);
    control.setTick(tick)
    const animate = new ControlAnimateDto();
    animate.setAnimation(animation);
    control.setAnimate(animate);
    const message = new ClientMsgDto();
    message.setControl(control);

    const binary = message.serializeBinary();
    const size = binary.length;
    const sizeArray = new ArrayBuffer(4);
    const dataView = new DataView(sizeArray);
    dataView.setUint32(0, size, false);
    socket.send(dataView);
    socket.send(binary);
  }

  return {
    gid,
    onMove,
    onAnimate
  };
}

export default useSocket;