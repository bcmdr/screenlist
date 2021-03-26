import './LoginControl.css';
import { useState } from 'react';
import onClickOutside from "react-onclickoutside";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";

function LoggedIn(props) {
  return (
    <>
      {props.revealed && 
        <button 
          class="sign-out" 
          onClick={() => {
            firebase
              .app()
              .auth()
              .signOut();
          }}>Sign Out</button>
      }
      <img alt="Profile" src={props.user.photoURL} className="avatar" onClick={(event) => props.setRevealed(!props.revealed)}></img>
    </>
  );
}

function LoggedOut(props) {
  return (
    <div>
      <button
        onClick={() => {
          const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(googleAuthProvider);
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}

function LoginControl() {
  const [revealed, setRevealed] = useState(false);
  LoginControl.handleClickOutside = () => setRevealed(false);
  return (
    <div className="LoginControl">
      <FirebaseAuthConsumer>
        {({ isSignedIn, user }) => {
          if (isSignedIn === true) {
            return <LoggedIn revealed={revealed} setRevealed={setRevealed} user={user}/>
          } else {
            return <LoggedOut />
          }
        }}
      </FirebaseAuthConsumer>
    </div>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => LoginControl.handleClickOutside,

};

export default onClickOutside(LoginControl, clickOutsideConfig);