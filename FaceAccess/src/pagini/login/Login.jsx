import "./login.scss"
import { useContext, useState } from "react"
import { signInWithEmailAndPassword  } from "firebase/auth";
import { auth } from "../../firebase"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {

  const [eroare, setEroare] = useState(0);
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext)

  const Conectare = (e) => {
    e.preventDefault();
    if (email.length >= 1 && parola.length >= 1) 
    {
      signInWithEmailAndPassword(auth, email, parola)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch({type:"LOGIN", payload:user})
          navigate("/");
        })
        .catch((eroare) => {
          setEroare(1);
        });
    }
    else 
    {
        setEroare(2);
    }
  }

  return (
    <div className="login">
      <form onSubmit={Conectare}>
        <div className="titlu">Autentificare</div>
        <input type="email" placeholder="email" onChange={e=>setEmail(e.target.value)}/>
        <input type="password" placeholder="parola" onChange={e=>setParola(e.target.value)} />
        <button type="submit">Conectare</button>
        {eroare === 1 && <span>Email sau parolă greșită</span>}
        {eroare === 2 && <span>Câmpuri necompletate</span>}
        <Link to="/modificare" style={{textDecoration:"none"}}>
            <div className="parola">Dorești să modifici parola?</div>
        </Link>
      </form>
    </div>
  )
}

export default Login