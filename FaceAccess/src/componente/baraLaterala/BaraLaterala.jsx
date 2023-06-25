import "./baraLaterala.scss";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import LogoutIcon from '@mui/icons-material/Logout';
import CastIcon from '@mui/icons-material/Cast';
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const BaraLaterala = () => {
  const navigare = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const Deconectare = () => {  
    signOut(auth).then(() => {
      dispatch({type:"LOGOUT"});
      navigare("/login");
    }).catch((eroare) => {
      console.log(eroare);
    });
  }

  return (
    <div className="baraLaterala">
      <div className="top">
        <Link to="/" style={{textDecoration:"none"}}>
          <span className="logo">FaceAccess</span>
        </Link>
      </div>
      <div className="centru">
        <ul>
          <p className="titlu">Principal</p>
          <li>
            <SpaceDashboardIcon className="icon" />
            <Link to="/" style={{textDecoration:"none"}}>
              <span>Tablou de bord</span>
            </Link>
          </li>
          <p className="titlu">Bază de date</p>
          <Link to="/utilizatori" style={{textDecoration:"none"}}>
            <li>
              <PeopleAltIcon className="icon" />
              <span>Utilizatori</span>
            </li>
          </Link>
          <Link to="/inregistrari" style={{textDecoration:"none"}}>
          <li>
            <ChecklistRtlIcon className="icon" />
            <span>Înregistrari</span>
          </li>
          </Link>
          <p className="titlu">Live</p>
          <li>
            <CastIcon className="icon" />
            <Link to="/livestream" style={{textDecoration:"none"}}>
              <span>Livestream</span>
            </Link>
          </li>
          <p className="titlu">Administrator</p>
          <li>
            <LogoutIcon className="icon" />
            <span onClick={Deconectare}>Deconectare</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BaraLaterala