import { useState } from "react";
import {
  query,
  orderBy,
  limit,
  collection,
  doc,
  onSnapshot,
  onDisconnect,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { app, db } from "./firebaseConfig";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    if (message === "") return;
    setMessage("");
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        time: Date.now(),
        message: message,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function updateChat() {
    const messagesTemp = [];
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("time", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      messagesTemp.push(doc.data().message);
    });
    setMessages([...messagesTemp]);
  }

  return (
    <>
      <h1>chat bellissima di pie999 2.0</h1>
      <div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button onClick={sendMessage}>invia</button>
        <button onClick={updateChat}>aggiorna chat</button>
      </div>
      <div>
        {messages.map((mess) => (
          <p>{mess}</p>
        ))}
      </div>
    </>
  );
}

export default App;
