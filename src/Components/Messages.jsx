import React, { useContext, useEffect, useState } from 'react';
import Message from "./Message";
import { ChatContext } from "./context/ChatContext";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from "./firebase";


const Messages = () => {
  const [messages, setMessages] = useState([]); 
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (data.chatId) { // Check if chatId is not null before fetching messages
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages);
        } else {
          setMessages([]); // Reset messages if document doesn't exist
        }
      });

      return () => {
        unSub();
      };
    }
  }, [data.chatId]);

  console.log(messages);

  return (
    <div className='messages'>
      {messages.map(m => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;