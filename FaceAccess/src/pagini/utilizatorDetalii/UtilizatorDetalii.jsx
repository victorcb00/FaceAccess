import "./utilizatorDetalii.scss";
import BaraLaterala from "../../componente/baraLaterala/BaraLaterala";
import Diagrama from "../../componente/diagrama/Diagrama";
import TabelEditabilUtilizatorDetalii from "../../componente/tabelEditabil/TabelEditabilUtilizatorDetalii";
import { useParams, Link } from 'react-router-dom';
import { db } from "../../firebase";
import { getDoc, doc, collection, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Confirm } from 'react-admin';
import { useNavigate } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebase";

const UtilizatorDetalii = () => {
  const { utilizatorID } = useParams();
  const [informatie, setInformatie] = useState({});
  const [open, setOpen] = useState(false);
  const navigare = useNavigate();

  useEffect(()=>{
    const obtinereInformatie = async () => {
      const utilizator = await getDoc(doc(db, "utilizatori", utilizatorID));
      setInformatie(utilizator.data());
      console.log(utilizator.data());
    }
    obtinereInformatie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const confirmare = () => {
    setOpen(true);
  }

  const sterge = async () => {
    setOpen(false);
    try {
        await deleteDoc(doc(db, "utilizatori", utilizatorID));
        const interogare = query(
            collection(db, "inregistrari"),
            where("utilizatorID", "==", utilizatorID)
        );
        const documente = await getDocs(interogare);
        let data = [];
        documente.forEach((doc) => {
            data.push(doc.id);
          });
        for(let i = 0; i<data.length; i++)
        {
            await deleteDoc(doc(db, "inregistrari", data[i]));
        }

        const interogare1 = query(
            collection(db, "imagini"),
            where("utilizatorID", "==", utilizatorID)
        );
        const documente1 = await getDocs(interogare1);
        data = [];
        documente1.forEach((doc) => {
            data.push(doc.id);
          });
        for(let i = 0; i < data.length; i++)
        {
            deleteObject(ref(storage, '/Imagini/' + informatie.nume + '_' + informatie.prenume + '_' + utilizatorID + '/' + i));
            await deleteDoc(doc(db, "imagini", data[i]));
        }
        setInformatie(informatie.filter((item) => item.id !== utilizatorID));
      } catch(eroare) {
          console.log(eroare);
      } 

      navigare(-1);
  }
  
  const anulare = () => {
      setOpen(false);
  }

  return (
    <div className="utilizatorDetalii">
      <BaraLaterala />
      <div className="utilizatorDetaliiContainer">
        <div className="top">
          <div className="stanga">
            <div className="stergeButon" onClick={confirmare}>Șterge</div>
            <Link to={"/utilizatori/" + utilizatorID + "/editeaza"} style={{textDecoration:"none"}}>
              <div className="editeazaButon">Editează</div>
            </Link>
            <div className="articol">
              <img 
                src={informatie.imagine} 
                alt=""
                className="articolImagine"
              />
              <div className="detalii">
                <h1 className="articolTitlu">{informatie.nume + " " + informatie.prenume}</h1>
                <div className="detaliiArticol">
                  <span className="articolNume">Email:</span>
                  <span className="articolValoare">{informatie.email}</span>
                </div>
                <div className="detaliiArticol">
                  <span className="articolNume">Telefon:</span>
                  <span className="articolValoare">{informatie.telefon}</span>
                </div>
                <div className="detaliiArticol">
                  <span className="articolNume">Adresa:</span>
                  <span className="articolValoare">{informatie.adresa}</span>
                </div>
                <div className="detaliiArticol">
                  {informatie.status ? <span className="articolStatus intrat">Intrat</span> 
                    : <span className="articolStatus iesit">Ieșit</span>}
                </div>
              </div>
          </div>
          </div>
          <div className="dreapta">
            <Diagrama tip={utilizatorID} aspect={3 / 1} title="Înregistrarile utilizatorului în ultimile 7 zile" />
          </div>
        </div>
        <div className="jos">
          {/*<h1 className="titlu">Înregistrările utilizatorului</h1>*/}
          <TabelEditabilUtilizatorDetalii />
        </div>
      </div>
      <Confirm
                isOpen={open}
                title={`Șterge utilizatorul`}
                content={"Sigur doriți să ștergeți utilizatorul " + informatie.nume + " " + informatie.prenume + " cu toate înregistrările și imaginile încărcate?"} 
                onConfirm={sterge}
                onClose={anulare}
                confirm="Șterge"
                cancel="Anulează"
            />
    </div>
  )
}

export default UtilizatorDetalii