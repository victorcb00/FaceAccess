import './widget.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from 'react-router-dom';

const Widget = ({tip}) => {
  const [nr, setNr] = useState(null);
  const [procentaj, setProcentaj] = useState(null);
  let informatie;

  switch(tip) {
    case "utilizatori":
      informatie = {
        titlu: "Utilizatori",
        link: "Toți utilizatorii",
        interogare:"utilizatori",
        camp: "data_creare",
        icon: ( 
          <PeopleAltIcon 
            className="icon" 
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }} 
          />
        ),
      };
      break;
    case "inregistrari":
      informatie = {
        titlu: "Înregistrări",
        link: "Toate înregistrările",
        interogare: "inregistrari",
        camp: "data_intrare",
        icon: ( 
          <ChecklistRtlIcon 
            className="icon" 
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218, 165, 32, 0.2)",
            }} 
          />
        ),      
      };
      break;
    default:
      break;
  }

  useEffect(()=> {
    const cautaNr = onSnapshot(
      collection(db, tip), 
      (documente) => {
        setNr(documente.docs.length);
        setareProcentaj();
      },
      (eroare) => {
        console.log(eroare);
      }
    );

    const setareProcentaj = async () => {
      const azi = new Date();
      const lunaTrecuta = new Date(new Date().setMonth(azi.getMonth() - 1));
      const lunaMaiTrecuta = new Date(new Date().setMonth(azi.getMonth() - 2));
    
      const lunaTrecutaInterogare = query(
        collection(db, informatie.interogare),
        where(informatie.camp, ">", lunaTrecuta)
      );
      const lunaMaiTrecutaInterogare = query(
        collection(db, informatie.interogare), 
        where(informatie.camp, "<=", lunaTrecuta),
        where(informatie.camp, ">", lunaMaiTrecuta)
      );

      const lunaTrecutaInformatie = await getDocs(lunaTrecutaInterogare);
      const lunaMaiTrecutaInformatie = await getDocs(lunaMaiTrecutaInterogare);
      
      if (lunaMaiTrecutaInformatie.docs.length === 0)
        setProcentaj(0);
      else
        setProcentaj(((lunaTrecutaInformatie.docs.length - lunaMaiTrecutaInformatie.docs.length) / lunaMaiTrecutaInformatie.docs.length) * 100);
    };
    
    return () => {      
      cautaNr();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className="widget">
      <div className="stanga">
        <span className="titlu">{informatie.titlu}</span>
        <span className="contor">
          {nr}
        </span>
        <Link to={"/" + tip} style={{textDecoration:"none"}}>
          <span className="link">{informatie.link}</span>
        </Link>
      </div>
      <div className="dreapta">
          {procentaj < 0 && <div className={`procentaj negativ`}><KeyboardArrowDownIcon />{procentaj} %</div>}
          {procentaj > 0 && <div className={`procentaj pozitiv`}><KeyboardArrowUpIcon />+{procentaj} %</div>}
          {procentaj === 0 && <div className={`procentaj neutru`}>0 %</div>}
        {informatie.icon}
      </div>
    </div>
  )
}

export default Widget