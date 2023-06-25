import "./tabelEditabil.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import MUIDataTable from "mui-datatables";

const dataFormat = "DD.MM.YYYY, HH:mm:ss";

const getHyphenatedDate = dateString =>
  moment(dateString, "DD.MM.YYYY, HH:mm:ss").format(dataFormat);

const TabelEditabilInregistrari = () => {
    const [informatie, setInformatie] = useState([]);

    useEffect(() => {
        const cauta = onSnapshot(
            collection(db, "inregistrari"), 
            (snapShot) => {
                let lista = [];
                snapShot.docs.forEach(doc => {
                    lista.push({id: doc.id, ...doc.data()});
                });
                setInformatie(lista);
                console.log(lista);
            },
            (eroare) => {
                console.log(eroare);
            }
        );

        return () => {
            cauta()
        };
    }, []);
    
    const inregistrare = informatie.map(rand => {
      const randActualizare = {
        ...rand,
        numePrenume: rand.nume + " " + rand.prenume,
        data_intrare: getHyphenatedDate(rand.data_intrare.toDate().toLocaleString('ro-RO')),
        data_iesire: getHyphenatedDate(rand.data_iesire.toDate().toLocaleString('ro-RO')),
        data_intrare1: moment(rand.data_intrare.toDate().toLocaleString('ro-RO'), "DD.MM.YYYY, HH:mm:ss")
            .toDate()
            .getTime(),
        data_iesire1: moment(rand.data_iesire.toDate().toLocaleString('ro-RO'), "DD.MM.YYYY, HH:mm:ss")
            .toDate()
            .getTime(),
        data_modificare: getHyphenatedDate(rand.data_modificare.toDate().toLocaleString('ro-RO')),
        data_modificare1: moment(rand.data_modificare.toDate().toLocaleString('ro-RO'), "DD.MM.YYYY, HH:mm:ss")
            .toDate()
            .getTime(),
      };
      return randActualizare;
    });

    const options = {
      filter: false,
      download: false,
      print: false,
      rowsPerPageOptions: [10],	
      viewColumns: false,
      selectableRows: "none",
    };
    
    const inregistrariColoane = [
        {
            name: "numePrenume",
            label: "Nume Prenume"
        },
        {
            name: "data_intrare1",
            label: "Data intrare",
            options: {
              customBodyRender: valoare =>
                moment(new Date(valoare)).format(dataFormat)
            }
        },
        {
            name: "data_iesire1",
            label: "Data ieșire",
            options: { 
              customBodyRender: valoare => {
                return valoare === 0 ? "---" : moment(new Date(valoare)).format(dataFormat)
              }
            }
        },
        {
            name: "data_modificare1",
            label: "Data modificare",
            options: { 
              customBodyRender: valoare =>
                moment(new Date(valoare)).format(dataFormat)
            }
        },
        {
            name: "utilizatorID",
            label: "Acțiune",
            options: {
                customBodyRender: (valoare) => {
                    return (
                        <div className="celulaActiune">
                        <Link to={"/utilizatori/" + valoare} style={{textDecoration:"none"}}>
                            <div className="detaliiButon">Detalii</div>
                        </Link></div>
                );}
            },
        }
    ];

    return (
        <div className="tabel">
            <div className="tabelTitlu">
                Afișare tabel înregistrări
            </div>

            <MUIDataTable
                data={inregistrare}
                columns={inregistrariColoane}
                options={options}
                size="small"
            />
        </div>
    )
}

export default TabelEditabilInregistrari