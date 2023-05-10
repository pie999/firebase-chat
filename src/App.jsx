import "./App.css";
import Auth from "./Auth";
import Chat from "./Chat";
import { auth } from "./firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    });

    return () => {
      listen();
    };
  });

  return <>{signedIn ? <Chat /> : <Auth />}</>;
}
