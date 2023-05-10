import { useState, useEffect, useRef } from "react";
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
import { db, auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import toReadableTime from "./timeHelper";
import sendIcon from "./send.svg";
import "./Chat.css";

export default function Chat() {
  const [text, setText] = useState("");
  const [newMessage, setNewMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  if (newMessage) {
    setMessages([...messages, newMessage]);
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
      initialMessages.reverse();
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

  useEffect(() => {
    const chatNode = chatRef.current;

    const observer = new MutationObserver(() => {
      chatNode.scrollTop = chatNode.scrollHeight;
    });
    observer.observe(chatNode, { childList: true });

    const resizeObserver = new ResizeObserver(() => {
      chatNode.scrollTop = chatNode.scrollHeight;
    });
    resizeObserver.observe(chatNode);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (text === "") return;
    setText("");
    try {
      await addDoc(collection(db, "messages"), {
        userName: auth.currentUser.displayName,
        time: Date.now(),
        text: text,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        // onAuthStateChanged si occuperà del resto, qui non devi fare niente
      })
      .catch((error) => {
        // An error happened.
      });
  }

  return (
    <div className="chat-container">
      <div ref={chatRef} className="chat-div">
        <p className="by">
          made by <a href="https://github.com/pie999/firebase-chat">pie999</a>
        </p>
        <div className="signoutbtn-container">
          <button className="signoutbtn" onClick={handleSignOut}>
            esci
          </button>
        </div>

        {messages.map((message) => (
          <div key={message.id} className="message">
            <p className="username">{message.userName}</p>
            <p className="message-text">
              {message.text}
              <span className="message-time">
                {toReadableTime(message.time)}
              </span>
            </p>
          </div>
        ))}
      </div>
      <form className="input-div" onSubmit={(e) => handleSubmit(e)}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="scrivi un messaggio..."
        ></input>
        <button type="submit">
          <img src={sendIcon} alt="" />
        </button>
      </form>
    </div>
  );
}