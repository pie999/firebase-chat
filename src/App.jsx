import { useState, useEffect } from "react";
import {
  query,
  orderBy,
  limit,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("time", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(updatedMessages);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    if (text === "") return;
    setText("");
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        time: Date.now(),
        text: text,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <>
      <h1>chat bellissima di pie999 3.0</h1>
      <form onSubmit={(e) => sendMessage(e)}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="messaggio"
        ></input>
        <button type="submit">invia</button>
      </form>
      <div>
        {messages.map((message) => (
          <p key={message.id}>{message.text}</p>
        ))}
      </div>
    </>
  );
}

export default App;
