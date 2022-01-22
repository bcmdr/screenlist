import './LoginControl.css';
import { useState } from 'react';
import onClickOutside from "react-onclickoutside";
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from "firebase/app";
import "firebase/auth";

function LoggedIn(props) {
  return (
    <>
      {props.revealed && 
        <button 
          className="sign-out" 
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
  const [user, loading, error] = useAuthState(firebase.auth());
  LoginControl.handleClickOutside = () => setRevealed(false);
  if (error) {
    console.log(error);
  }

  if (loading) {
    return (
      <button className="login-loading">
        Loading
      </button>
    )
  }
  return (
    <div className="LoginControl">
      { user && 
          <LoggedIn revealed={revealed} setRevealed={setRevealed} user={user}/>
      }
      { !user && 
        <LoggedOut />
      }
    </div>
  );
  

}

const clickOutsideConfig = {
  handleClickOutside: () => LoginControl.handleClickOutside,

};

export default onClickOutside(LoginControl, clickOutsideConfig);