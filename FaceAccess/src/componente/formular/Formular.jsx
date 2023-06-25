import "./formular.scss";
import { utilizatorInput } from "../../formInputs";
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage";
import { addDoc, collection, deleteDoc, doc, query, where, getDocs, updateDoc, getDoc  } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

const Formular = ({tip}) => {
    const [fisier, setFisier] = useState("");
    const [imagine, setImagine] = useState("");
    const [informatie, setInformatie] = useState({});
    const [nume, setNume] = useState();
    const [prenume, setPrenume] = useState();
    const [procentaj, setProcentaj] = useState(0);
    const [eroare, setEroare] = useState({});
    const navigare = useNavigate();
    const { utilizatorID } = useParams();
    let value = 0;

    useEffect(() => {
        const obtinereInformatie = async () => {
            if (value === 0) {
              const utilizator = await getDoc(doc(db, "utilizatori", utilizatorID));
              setInformatie(utilizator.data());
              setNume(utilizator.data().nume);
              setPrenume(utilizator.data().prenume);
              setImagine(utilizator.data().imagine);
              value++;
            }
        }
        return () => {
            if (tip === "editeaza") {
                obtinereInformatie();
                setEroare({nume: "", 
                prenume: "", 
                email: "",
                telefon: "",
                adresa: "",
                imagine: "",
                status: false});
            }
            else
              setEroare({nume: "Câmp obligatoriu", 
                prenume: "Câmp obligatoriu", 
                email: "Câmp obligatoriu",
                telefon: "Câmp obligatoriu",
                adresa: "Câmp obligatoriu",
                imagine: "",
                status: false});
        };
    }, []);
    
    const uploadFisier = async (id, nume, prenume, nr) => {
      const stocareReferinta = ref(storage, "Imagini/" + nume + "_" + prenume + "_" + id + "/" + nr);
      const incarcareFisier = uploadBytesResumable(stocareReferinta, fisier[nr]);
  
      incarcareFisier.on(
        'state_changed', 
        (imagine) => {
          const progres = (imagine.bytesTransferred / imagine.totalBytes) * 100;
          setProcentaj(progres);
        }, 
        (eroare) => {
          console.log(eroare);
        },
        () => {
          if (nr === 0) 
          {
            getDownloadURL(incarcareFisier.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, 'utilizatori', id), {
                ...informatie, imagine: downloadURL
              })
            });
          }
          getDownloadURL(incarcareFisier.snapshot.ref).then(async (descarcareURL) => {
            await addDoc(collection(db, "imagini"), {
              utilizatorID: id, imagine: descarcareURL
            });
          });
        })
    };
  
    const TratareInput = (e) => {
        const id = e.target.id;
        let valoare = e.target.value;
        if (!(id === "adresa"))
          valoare = valoare.trim();
        if (valoare === "")
          setEroare({...eroare, [id]: "Câmp obligatoriu"});
        else {
          if (id === "nume")
            if (/^[A-Za-zĂÂÎȘȚăâîșț]+$/.test(valoare))
              setEroare({...eroare, nume: ""});
            else
              setEroare({...eroare, nume: "Nume incorect"});
          else if (id === "prenume")
            if (/^[A-Za-zĂÂÎȘȚăâîșț]+$/.test(valoare))
              setEroare({...eroare, prenume: ""});
            else
              setEroare({...eroare, prenume: "Prenume incorect"});
          else if (id === "email")
            if (/^[\w-.ăâîșțĂÂÎȘȚ]+@([\w-]+.)+[\w-]{2,4}$/.test(valoare))
              setEroare({...eroare, email: ""});
            else
              setEroare({...eroare, email: "Email incorect"});
          else if (id === "telefon")
            if (/^0(7[0-9]{8})$/.test(valoare))
              setEroare({...eroare, telefon: ""});
            else
              setEroare({...eroare, telefon: "Telefon incorect"});
          else if (id === "adresa")
            if (/^[a-zA-Z0-9\s.,-ăâîșțĂÂÎȘȚ]+$/.test(valoare))
              setEroare({...eroare, adresa: ""});
            else
              setEroare({...eroare, adresa: "Adresă incorect"});
        }
        setInformatie({...informatie, [id]:valoare });
    }

    const TratareFisier = (e) => {
        setFisier(e.target.files); 
        setImagine(URL.createObjectURL(e.target.files[0]));
        if (e.target.files.length < 5)
          setEroare({...eroare, imagine: "Minim 5 imagini"});
        else
          setEroare({...eroare, imagine: ""});
    }
   
    const Adauga = async(e) => {
        setEroare({...eroare, status: true});
        if (informatie.adresa)
          informatie.adresa = informatie.adresa.trim();
        e.preventDefault();
        if (eroare.nume === "" && 
            eroare.prenume === "" && 
            eroare.email === "" && 
            eroare.telefon === "" &&
            eroare.adresa === "" &&
            eroare.imagine === "")
        {
          try {
            if (tip === "nou") 
            {
              const documentReferinta = await addDoc(collection(db, "utilizatori"), {
              ...informatie, status: false, data_creare: new Date()
              });
              for (let i = 0; i < fisier.length; i++)
                uploadFisier(documentReferinta.id, informatie.nume, informatie.prenume, i);
            }
            else
            {
              const documentReferinta = await addDoc(collection(db, "utilizatori"), {
                ...informatie
                });
              const interogare = query(
                collection(db, "inregistrari"),
                where("utilizatorID", "==", utilizatorID)
              );
              const documente = await getDocs(interogare);
              let data = [];
              documente.forEach((doc) => {
                data.push(doc.id);
                });
              for(let i = 0; i < data.length; i++)
              {
                await updateDoc(doc(db, "inregistrari", data[i]), {
                  nume: informatie.nume, prenume: informatie.prenume, utilizatorID: documentReferinta.id
                });
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
                deleteObject(ref(storage, '/Imagini/' + nume + '_' + prenume + '_' + utilizatorID + '/' + i));
                await deleteDoc(doc(db, "imagini", data[i]));
              }
              for (let i = 0; i < fisier.length; i++)
                uploadFisier(documentReferinta.id, informatie.nume, informatie.prenume, i);
              await deleteDoc(doc(db, "utilizatori", utilizatorID));
            }
          } catch(eroare) {
              console.log(eroare);
          };
          navigare("/");
        }
    }
  
    return (
    <div className="containerNou">
        <div className="top">
        <h2>Adaugă utilizator nou</h2>
        </div>
        <div className="jos">
        <div className="stanga">
            <img 
            src={
                imagine 
                ? imagine
                : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930" 
            }
            alt="Imagine nevalabilă" 
            />
        </div>
        <div className="dreapta">
            <form onSubmit={Adauga}>
            <div className="formularInput">
                <label className="textIcon" htmlFor="file" >
                Image: <DriveFolderUploadOutlinedIcon className="icon" />
                <label className="labelEroare">{eroare.imagine}</label>
                </label>
                <input 
                type="file"
                multiple="multiple" 
                accept="image/*"
                id="file" 
                onChange={e=>{TratareFisier(e)}} 
                style={{display: "none"}}
                />
            </div>
            {utilizatorInput.map(utilizatorInput => (
                <div className="formularInput" key={utilizatorInput.id}>
                <label className="labelNume">
                    {utilizatorInput.label}
                    <label className="labelEroare">{eroare.status ? eroare[utilizatorInput.id] : ""}</label>
                </label>
                <input
                    id={utilizatorInput.id}
                    value={informatie[utilizatorInput.id]}
                    type={utilizatorInput.type} 
                    placeholder={utilizatorInput.placeholder} 
                    onChange={TratareInput}/>
                </div>
            ))}
            <button type="submit">Trimite</button>
            </form>
        </div>
        </div>
    </div>
    )
  }
  /*disabled={procentaj !== 0 && procentaj < (100 * fisier.length)}*/
  export default Formular