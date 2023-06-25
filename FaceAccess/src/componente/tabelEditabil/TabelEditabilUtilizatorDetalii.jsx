import "./tabelEditabil.scss";
import moment from "moment";
import { useState, useEffect } from "react";
import { collection, onSnapshot, where, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";

const dataFormat = "DD.MM.YYYY, HH:mm:ss";

const getHyphenatedDate = dateString =>
  moment(dateString, "DD.MM.YYYY, HH:mm:ss").format(dataFormat);

const TabelEditabilUtilizatorDetalii = () => {
    const [informatie, setInformatie] = useState([]);
    const { utilizatorID } = useParams();

    useEffect(() => {
        const interogare = query(
            collection(db, "inregistrari"),
            where("utilizatorID", "==", utilizatorID)
            );
            
          const cautaInregistrariUtilizator = onSnapshot(interogare, (querySnapshot) => {
            const lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({id: doc.id, 
                    data_intrare: doc.data().data_intrare,
                    data_iesire: doc.data().data_iesire});
            });
            setInformatie(lista);
        });


        return () => {
            cautaInregistrariUtilizator()
        };
        // eslint-disable-next-line
    }, []);
    
    const inregistrare = informatie.map(rand => {
      const randActualizare = {
        ...rand,
        id: rand.id,
        data_intrare: getHyphenatedDate(rand.data_intrare.toDate().toLocaleString('ro-RO')),
        data_iesire: getHyphenatedDate(rand.data_iesire.toDate().toLocaleString('ro-RO')),
        data_intrare1: moment(rand.data_intrare.toDate().toLocaleString('ro-RO'), "DD.MM.YYYY, HH:mm:ss")
          .toDate()
          .getTime(),
        data_iesire1: moment(rand.data_iesire.toDate().toLocaleString('ro-RO'), "DD.MM.YYYY, HH:mm:ss")
        .toDate()
        .getTime()
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
              customBodyRender: valoare =>
                valoare === 0 ? "---" : moment(new Date(valoare)).format(dataFormat)
            }
        }
    ];

    return (
        <div className="tabel">
            <div className="tabelTitlu">
                Afișarea înregistrărilor utilizatorului
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

export default TabelEditabilUtilizatorDetalii