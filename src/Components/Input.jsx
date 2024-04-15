import React, { useContext, useState } from 'react';
import Img from "../Img/img.png";
import Attach from "../Img/attach.png";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from "./firebase";
import {v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = async () => {
    try {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            // Handle upload error
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(async (downloadURL) => {
                await updateChat(downloadURL);
              })
              .catch((error) => {
                // Handle download URL retrieval error
                console.error("Error getting download URL:", error);
              });
          }
        );
      } else {
        await updateChat();
      }
    } catch (error) {
      // Handle any other errors
      console.error("Error sending message:", error);
    }
  };

  const updateChat = async (downloadURL = null) => {
    const messageData = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      img: downloadURL,
    };

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion(messageData),
    });

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className='input'>
        <input type='text' placeholder='Type something...' onChange={e=>setText(e.target.value)} onKeyDown={handleKeyDown} value={text}/>
        <div className='send'>
            <img src={Attach} alt=""/>
            <input type="file" style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>
            <label htmlFor='file'>
                <img src={Img} alt=""/>
            </label>
            <button onClick={handleSend}>Send</button>
        </div>
    </div>
  );
};

export default Input;