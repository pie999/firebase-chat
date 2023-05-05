import { useState, useEffect } from "react";
import {
  query,
  orderBy,
  limit,
  where,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [newMessage, setNewMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  if (newMessage) {
    setMessages([newMessage, ...messages]);
    setNewMessage(null);
  }

  useEffect(() => {
    (async () => {
      // Read initial 20 messages
      const q1 = query(
        collection(db, "messages"),
        orderBy("time", "desc"),
        limit(20)
      );
      let initialMessages = [];
      const querySnapshot = await getDocs(q1);
      querySnapshot.forEach((doc) => {
        initialMessages.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setMessages(initialMessages);

      // Listen to the latest message
      const q2 = query(
        collection(db, "messages"),
        where("time", ">=", Date.now()), // skip initial data read
        orderBy("time", "desc"),
        limit(1)
      );
      const unsubscribe = onSnapshot(q2, (snapshot) => {
        const latestMessage = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewMessage(...latestMessage);
      });
      return () => {
        unsubscribe();
      };
    })();
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
