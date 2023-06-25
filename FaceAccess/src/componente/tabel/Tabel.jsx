import "./tabel.scss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Tabel = () => {
  const [informatie, setInformatie] = useState([]);

  useEffect(() => {
    const interogare = query(
      collection(db, "inregistrari"),
      orderBy("data_modificare", "desc"),
      limit(10)
      );
      
    const cauta = onSnapshot(interogare, (documente) => {
      const lista = [];
      documente.forEach((document) => {
          lista.push({id:document.id, ...document.data() });
      });
      setInformatie(lista);
    });

    return () => {      
      cauta();
    };
  },[])

  return (
    <TableContainer component={Paper} className="tabel">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="numeCamp">Nume Prenume</TableCell>
            <TableCell className="numeCamp">Data intrare</TableCell>
            <TableCell className="numeCamp">Data ieșire</TableCell>
            <TableCell className="numeCamp">Utilizator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {informatie.map((document) => (
            <TableRow 
              key={document.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
              <TableCell>{document.nume} {document.prenume}</TableCell>
              <TableCell>{document.data_intrare.toDate().toLocaleString('ro-RO')}</TableCell>
              <TableCell>
                {document.data_iesire.toDate().toLocaleString('ro-RO') === "01.01.1970, 02:00:00" ? "---" 
                : document.data_iesire.toDate().toLocaleString('ro-RO')}
              </TableCell>
              <TableCell className="celulaActiune">
                <Link to={"/utilizatori/" + document.utilizatorID} style={{textDecoration:"none"}}>
                  <div className="utilizatorButon">Utilizator</div>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Tabel