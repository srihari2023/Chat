import React, { useContext, useRef, useState } from 'react';
import Cam from "../Img/cam.png";
import Add from "../Img/add.png";
import More from "../Img/more.png";
import Clear from "../Img/delete icon.jpg"
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "./context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const {clearChat} = useContext(ChatContext)
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);

  // Function to start video streaming
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing video stream:', error);
    }
  };

  // Function to stop video streaming
  const stopVideo = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  return (
    <div className='chat'>
      <div className='chatInfo'>
        <span>{data.user?.displayName}</span>
        <div className='chatIcons'>
          <img src={Cam} alt='' onClick={startVideo} />
          <img src={Add} alt='' />
          <img src={More} alt='' onClick={stopVideo} />
        </div>
      </div>
      <video ref={videoRef} style={{ display: mediaStream ? 'block' : 'none' }} autoPlay playsInline muted />
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;