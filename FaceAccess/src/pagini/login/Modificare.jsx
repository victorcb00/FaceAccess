import "./login.scss"
import { useContext, useState } from "react"
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { auth } from "../../firebase"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Modificare = () => {

  const [eroare, setEroare] = useState(0);
  const [email, setEmail] = useState("");
  const [parolaVeche, setParolaVeche] = useState("");
  const [parolaNoua, setParolaNoua] = useState("");

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext)

  const Conectare = (e) => {
    e.preventDefault();
    if (email.length >= 1 && parolaVeche.length >= 1 && parolaNoua.length >= 1)
    {
        if (parolaNoua.length >= 6)
        {
            signInWithEmailAndPassword(auth, email, parolaVeche)
            .then((userCredential) => {
                const user = userCredential.user;
                updatePassword(user, parolaNoua)
                dispatch({type:"LOGIN", payload:user})
                navigate("/");
            })
            .catch((eroare) => {
                setEroare(1);
            });
        }
        else 
        {
            setEroare(3);
        }
    }
    else 
    {
        setEroare(2);
    }
  }

  return (
    <div className="login">
      <form onSubmit={Conectare}>
        <div className="titlu">Modificare parolă</div>
        <input type="email" placeholder="email" onChange={e=>setEmail(e.target.value)}/>
        <input type="password" placeholder="parola veche" onChange={e=>setParolaVeche(e.target.value)}/>
        <input type="password" placeholder="parola nouă" onChange={e=>setParolaNoua(e.target.value)} />
        <button type="submit">Conectare</button>
        {eroare === 1 && <span>Credențiale greșite</span>}
        {eroare === 2 && <span>Câmpuri necompletate</span>}
        {eroare === 3 && <span>Parola nouă trebuie să aibă minim 6 caractere</span>}
        <Link to="/login" style={{textDecoration:"none"}}>
            <div className="parola">Autentificare</div>
        </Link>
        
      </form>
    </div>
  )
}

export default Modificare