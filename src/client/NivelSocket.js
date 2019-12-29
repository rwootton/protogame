import {useEffect, useState} from 'react';
import {
  ServerMsgDto, 
  ClientMsgDto, 
  ControlDto,
  EventDto, 
  EntityDto
} from '../proto/nivel_pb';

let socket;
let gid;

const useSocket = ({onTick}) => {
  useEffect(()=>{
    socket = new WebSocket("wss://www.randalloveson.com:443/~rakel/protogame/levelone");
    socket.onopen = e=>{
      console.log('open', e)
    }
    socket.onmessage = e=>{
      e.data.arrayBuffer().then((theData)=>{
        const size = new DataView(theData, 0, 4).getUint32(0, false);
        const binary = theData.slice(4, 4+size);
        const message = ServerMsgDto.deserializeBinary(binary).toObject();
        if(message.youre) {
          gid = message.youre.gid;
          // console.log(gid)
        }
        // console.log(message)
      })
    }
    socket.onclose = e=>{
      console.log('close', e);
    }
  }, []);

  const onMove = () => {

  }

  return {
    onMove
  };
}

export default useSocket;