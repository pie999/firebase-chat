import "./App.css";
import { useEffect, useState, lazy, Suspense } from "react";
import { auth, realtimeDB } from "./firebaseConfig";
import { ref, onDisconnect, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
const Auth = lazy(() => import("./Auth"));
const Chat = lazy(() => import("./Chat"));
const Loading = lazy(() => import("./Loading"));

// const presenceRef = ref(realtimeDB, "presence/");

export default function App() {
  const [signedIn, setSignedIn] = useState("loading");

  useEffect(() => {
    let userID;
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true);
        userID = user.uid;
        update(ref(realtimeDB, "presence/" + userID), {
          online: true,
          name: user.displayName,
          id: user.uid,
        });
        onDisconnect(ref(realtimeDB, "presence/" + userID)).update({
          online: false,
        });
      } else {
        setSignedIn(false);
        update(ref(realtimeDB, "presence/" + userID), {
          online: false,
        });
      }
    });

    return () => {
      listen();
    };
  }, []);

  let content;
  if (signedIn === "loading") {
    content = <Loading />;
  } else if (signedIn === true) {
    content = <Chat />;
  } else if (signedIn === false) {
    content = <Auth />;
  }

  return <Suspense>{content}</Suspense>;
}
