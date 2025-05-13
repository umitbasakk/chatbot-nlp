import { useRef, useState } from 'react';
import './App.css';
import Card from './Card'; 
import izuLogo from "./assets/izu.png";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function App() {
  const [messages, setMessages] = useState([
    { message: "Hello, How can I help you?", sender: "system" },
  ]);
  const [isWaiting, setIsWaiting] = useState(false);
  const inputValue = useRef(null);

  const EnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  // Enter tuşunun yeni bir satır eklemesini engeller
      sendPrompt();
    }
  };

  const showSwal = () =>{
    withReactContent(Swal).fire({
      title: <i>!!!</i>,
      text:"Are you sure you want to delete the chat?",
      showCancelButton: true,
      icon: "question",
      confirmButtonText: "Yes",
    }).then((result) =>{
      if(result.isConfirmed){
        Swal.fire("Success!", "", "success");
        handleDelete();
      }
    })
  }

  function handleDelete(){
    setMessages((prevMessages) => [
      prevMessages[0], 
    ]); 
  }

  const sendPrompt = async () => {
    const text = inputValue.current.value;
    if (text === "") return;

    inputValue.current.value = "";  

    setMessages((prevMessages) => [
      ...prevMessages, 
      { message: text, sender: "user" },
    ]); 

    setIsWaiting(true);
    console.log(text);
    try {
      const OPENPIPE_API_KEY = 'opk_0244da56ed5dfdd27a4811e9c3d27bb8e00d756756'; // API anahtarınızı burada belirtiyoruz

      const response = await fetch('https://app.openpipe.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENPIPE_API_KEY}`, // Authorization başlığı
        },
        body: JSON.stringify({
          model: 'openpipe:beige-mails-move', // Model ismi
          messages: [
            {
              role: 'user',
              content: text, // Kullanıcı mesajı
            },
          ],
          store: true, // Veriyi saklama
          temperature: 0, // İstemci yanıt sıcaklığı
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Yanıtı JSON olarak al
        setMessages((prevMessages) => [
          ...prevMessages, 
          { message: data.choices[0].message.content , sender: "system" },
        ]); 
      } else {
        setMessages((prevMessages) => [
          ...prevMessages, 
          { message: "unfortunately I did not find an answer" , sender: "system" },
        ]); 
      }

    } catch (error) {
      console.log(error);
    }
    setIsWaiting(false); 
  };

  return (
    <>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <Card key={index} message={msg.message} sender={msg.sender} />
        ))}
        {isWaiting && (
          <div className="waiting-card">
            <div className="chat incoming">
              <div className="chat-content">
                <div className="chat-details">
                  <img src={izuLogo} height={70} width={300} alt="system-img" />
                  <p>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="typing-container">
        <div className="typing-content">
          <div className="typing-textarea">
            <textarea 
              id="chat-input" 
              ref={inputValue} 
              spellCheck="false" 
              placeholder="Enter a prompt here" 
              required
              onKeyDown={EnterKeyPress} // Enter tuşu ile 'sendPrompt' fonksiyonunu tetikleyin
            />
            <span onClick={sendPrompt} className="material-symbols-rounded">send</span>
          </div>
          <div className="typing-controls">
            <span onClick={showSwal} className="material-symbols-rounded">delete</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
