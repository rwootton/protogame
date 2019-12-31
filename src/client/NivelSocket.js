import {useEffect, useState} from 'react';
import {
  ServerMsgDto, 
  ClientMsgDto, 
  ActionDto,
  ActionGaitDto
} from '../proto/nivel_pb';

let socket;
 
const useSocket = ({onTick, user}) => {
  useEffect(()=>{
    socket = new WebSocket("wss://www.randalloveson.com:443/~rakel/protogame/levelone");
    socket.onopen = e=>{
      console.log('open', e)
      const message = new ClientMsgDto();
      message.setIam(user.id);
      sendMessage(message);
    }
    socket.onmessage = e=>{
      e && e.data && e.data.arrayBuffer().then((blob)=>{
        let offset = 0;
        while(offset < blob.byteLength) {
          const size = new DataView(blob, 0, 2).getUint16(0, false);
          offset += 2;
          const binary = blob.slice(offset, offset+size);
          offset += size;
          const message = ServerMsgDto.deserializeBinary(binary).toObject();
          onTick(message)
          console.log({message})
        }

      })
    }
    socket.onclose = e=>{
      console.log('close', e);
    }
  }, []);

  const onMove = ({gait, facing}) => {
    const action = new ActionDto();
    // const tick = 0;
    const tick = Math.round(new Date().getTime() / 8);
    action.setTick(tick)
    action.setActor(0)
    const gaitDto = new ActionGaitDto();
    gaitDto.setHeading(facing);
    gaitDto.setFacing(facing);
    gaitDto.setGait(gait);
    action.setGait(gaitDto);
    const message = new ClientMsgDto();
    message.setAction(action);

    sendMessage(message);
 }

  const onAnimate = ({animation}) => {
    const action = new ActionDto();
    // const tick = 0;
    const tick = Math.round(new Date().getTime() / 8);
    action.setTick(tick)
    action.setAnimate(animation);
    action.setActor(0);
    const message = new ClientMsgDto();
    message.setAction(action);

    sendMessage(message);
  }

  const onTake = ({id}) => {
    const action = new ActionDto();
    action.setActor(0);
    action.setTick(Math.round(new Date().getTime() / 8));
    action.setTake(id);
    const message = new ClientMsgDto();
    message.setAction(action);
    console.log('take', message.toObject())
    sendMessage(message);
  }

  const sendMessage = (message) => {
    const binary = message.serializeBinary();
    const size = binary.length;
    const sizeArray = new ArrayBuffer(2);
    const dataView = new DataView(sizeArray);
    dataView.setUint16(0, size, false);
    socket.send(dataView);
    socket.send(binary);
  }

  return {
    onMove,
    onAnimate,
    onTake
  };
}

export default useSocket;