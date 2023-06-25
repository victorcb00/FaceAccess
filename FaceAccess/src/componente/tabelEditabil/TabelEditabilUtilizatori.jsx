import "./tabelEditabil.scss";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db } from "../../firebase";
import MUIDataTable from "mui-datatables";
import { Confirm } from 'react-admin';
import { storage } from "../../firebase";

const TabelEditabilUtilizatori = () => {
    const [informatie, setInformatie] = useState([]);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(null);
    const [nume, setNume] = useState(null);
    const [prenume, setPrenume] = useState(null);

    useEffect(() => {
        const cauta = onSnapshot(
            collection(db, "utilizatori"), 
            (documente) => {
                let lista = [];
                documente.docs.forEach(doc => {
                    lista.push({id: doc.id, ...doc.data()});
                });
                setInformatie(lista);
            },
            (eroare) => {
                console.log(eroare);
            }
        );

        return () => {
            cauta()
        };
    }, []);

    const confirmare = (value) => {
        informatie.forEach( (document) => {
            if (document.id === value)
            {
                setNume(document.nume);
                setPrenume(document.prenume);
            }
        })
        setOpen(true);
        setId(value);
    }

    const sterge = async () => {
        setOpen(false);
        try {
            await deleteDoc(doc(db, "utilizatori", id));
            const interogare = query(
                collection(db, "inregistrari"),
                where("utilizatorID", "==", id)
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
                where("utilizatorID", "==", id)
            );
            const documente1 = await getDocs(interogare1);
            data = [];
            documente1.forEach((doc) => {
                data.push(doc.id);
              });
            for(let i = 0; i < data.length; i++)
            {
                deleteObject(ref(storage, '/Imagini/' + nume + '_' + prenume + '_' + id + '/' + i));
                await deleteDoc(doc(db, "imagini", data[i]));
            }
            setInformatie(informatie.filter((item) => item.id !== id));
        } catch(eroare) {
            console.log(eroare);
        } 
    }

    const anulare = () => {
        setOpen(false);
    }

    const utilizatoriColoane = [
        {
            name: "numePrenume",
            label: "Nume Prenume",
        },
        {
            name: "email",
            label: "Email",
        },
        {
            name: "telefon",
            label: "Telefon",
        },
        {
            name: "adresa",
            label: "Adresa",
        },
        {
            name: "status",
            label: "Status",
            options: {
                customBodyRender: (valoare) => {
                return (
                    valoare ? <span className={`status intrat`}>Intrat</span> 
                    : <span className={`status iesit`}>Ieșit</span> 
                )}
            }
        },
        {
            name: "id",
            label: "Acțiune",
            options: {
                customBodyRender: (value) => {
                return (
                    <div className="celulaActiune">
                        <Link to={"/utilizatori/" + value} style={{textDecoration:"none"}}>
                            <div className="detaliiButon">Detalii</div>
                        </Link>
                        
                        <div className="stergeButon" onClick={() => confirmare(value)}>Șterge</div>
                    </div>
                )}
            }
        },

    ];

    const utilizator = informatie.map(rand => {
      const actualizareRand = {
        ...rand,
        numePrenume: rand.nume + " " + rand.prenume,
      };
      return actualizareRand;
    });

    const options = {
      filter: false,
      download: false,
      print: false,
      rowsPerPageOptions: [10],	
      viewColumns: false,
      selectableRows: "none",
    };

    return (
        
        <div className="tabel">
            <div className="tabelTitlu">
                Afișare tabel utilizatori
                <Link to="/utilizatori/nou" className="link" >
                    Adaugă utilizator
                </Link>
            </div>

            <MUIDataTable
                data={utilizator}
                columns={utilizatoriColoane}
                options={options}
                size="small"
            />
            <Confirm
                isOpen={open}
                title={`Șterge utilizatorul`}
                content={"Sigur doriți să ștergeți utilizatorul " + nume + " " + prenume + " cu toate înregistrările și imaginile încărcate?"} 
                onConfirm={sterge}
                onClose={anulare}
                confirm="Șterge"
                cancel="Anulează"
            />
        </div>
    )
}

export default TabelEditabilUtilizatori