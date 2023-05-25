import "./Auth.css";
import { useState } from "react";
import { auth, realtimeDB } from "./firebaseConfig";
import { ref, update } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function Auth() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [signUpForm, setSignUpForm] = useState(true);

  async function signUp(e) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password).catch((err) =>
        console.log(err)
      );
      await updateProfile(auth.currentUser, { displayName: name }).catch(
        (err) => console.log(err)
      );
      update(ref(realtimeDB, "presence/" + auth.currentUser.uid), {
        name: auth.currentUser.displayName,
        id: auth.currentUser.uid,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function logIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // loggato. onAuthStateChanged si occuperà del resto.
      })
      .catch((error) => {
        console.log(error.code + " " + error.message);
      });
  }

  return (
    <>
      {signUpForm ? (
        <form className="sign-in-form" onSubmit={(e) => signUp(e)}>
          <div className="cont name-container">
            <label htmlFor="name">nome</label>
            <input
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="cont email-container">
            <label htmlFor="email">email</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="cont password-container">
            <label htmlFor="password">password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            Registrati
          </button>
          <p className="switch">
            Hai già un account?{" "}
            <button onClick={() => setSignUpForm(false)}>accedi</button>
          </p>
        </form>
      ) : (
        <form className="sign-in-form" onSubmit={(e) => logIn(e)}>
          <div className="cont email-container">
            <label htmlFor="email">email</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="cont password-container">
            <label htmlFor="password">password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            Accedi
          </button>
          <p className="switch">
            Non hai un account?{" "}
            <button onClick={() => setSignUpForm(true)}>registrati</button>
          </p>
        </form>
      )}
    </>
  );
}
