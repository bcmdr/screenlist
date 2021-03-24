import './LoginControl.css';
import { useState } from 'react';
import onClickOutside from "react-onclickoutside";

function LoginControl() {
  const [revealed, setRevealed] = useState(false);
  LoginControl.handleClickOutside = () => setRevealed(false);
  return (
    <div className="LoginControl">
      {revealed && 
        <div>Sign Out</div>
      }
      <img alt="avatar" className="avatar" onClick={(event) => setRevealed(!revealed)}></img>
    </div>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => LoginControl.handleClickOutside,

};

export default onClickOutside(LoginControl, clickOutsideConfig);