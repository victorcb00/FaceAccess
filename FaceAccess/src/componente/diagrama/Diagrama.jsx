import "./diagrama.scss";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const luna = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
]

const Diagrama = ({tip, aspect, titlu}) => {
  const [informatie, setInformatie] = useState([]);

  useEffect(() => {  
    let lista = [];
  
    const luni = async (nr) => {
      const azi = new Date();
      const lunaCurenta = new Date(azi.getFullYear(), azi.getMonth() - nr  + 1, 1);
      const lunaPrecedenta= new Date(azi.getFullYear(), azi.getMonth() - nr, 1);
      const interogare = query(
        collection(db, "inregistrari"),
        where("data_intrare", "<=", lunaCurenta),
        where("data_intrare", ">", lunaPrecedenta)
      );  
      const documente = await getDocs(interogare);
      lista.push({Nume: luna[lunaPrecedenta.getMonth()], Total: documente.docs.length});
      setInformatie(lista);
    }

    const zile = async (nr) => {
      const azi = new Date();
      const ziuaCurenta = new Date(azi.getFullYear(), azi.getMonth(), azi.getDate() - nr + 1);
      const ziuaPrecedenta= new Date(azi.getFullYear(), azi.getMonth(), azi.getDate() - nr);
      const interogare = query(
        collection(db, "inregistrari"),        
        where("data_intrare", "<=", ziuaCurenta),
        where("data_intrare", ">", ziuaPrecedenta),
        where("utilizatorID", "==", tip),
      ); 
      const documente = await getDocs(interogare);
      lista.push({Nume: ziuaPrecedenta.toLocaleDateString('ro-Ro'), Total: documente.docs.length});
      setInformatie(lista);
    }

    return () => {
      if (tip === "principala") {
        for (let i = 5; i >= 0; i--) {
          luni(i);
        }
      } else {
        for (let i = 6; i >= 0; i--) {
          zile(i);
        }
      }
    }
    // eslint-disable-next-line
  },[tip]);

  return (
    <div className="diagrama">
      <div className="titlu">{titlu}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart width={730} height={250} data={informatie}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="grilaDiagrama" />
          <XAxis dataKey="Nume"/>
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="Total" stroke="#8884d8" fillOpacity={1} fill="url(#total)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Diagrama