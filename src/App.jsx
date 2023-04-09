import { useState } from 'react'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import './App.css'

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";


const API_KEY = import.meta.env.API_KEY;
function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am chatGPT",
      sender: "ChatGPT",
      direction: "outgoing"
    }
  ])

  const handelSend = async(message)=>{
    const newMessage = {
      message: message,
      sender: "user"
    }
    const newMessages = [...messages, newMessage];
    setMessages(newMessages)
    setTyping(true);
    await processMessageToChatGPT(newMessages)
  }

  async function processMessageToChatGPT(chatMessages){

    let apiMessages = chatMessages.map((messageObject)=>{
      let role="";
      if(messageObject.sender == "ChatGPT"){
        role= "assistant"
      }else{
        role= "user"
      }
      return { role: role, content: messageObject.message}
    });

    const systemMessage={
      role: "system",
      content: "Explica todo como un pirata"
    }
    const apiRequestBody={
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    const options={
      method: "POST",
      headers:{
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
   
    }
    await fetch("https://api.openai.com/v1/chat/completions",options).then((data)=>{
      return data.json();
    }).then((data)=>{
      // console.log(data.choices[0].message.content)
      setMessages([...chatMessages,
      {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setTyping(false);
    })

  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handelSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
