import "./principala.scss";
import BaraLaterala from "../../componente/baraLaterala/BaraLaterala";
import Widget from "../../componente/widget/Widget";
import Diagrama from "../../componente/diagrama/Diagrama";
import Tabel from "../../componente/tabel/Tabel";

const Principal = () => {

  return (
    <div className="principala">
      <BaraLaterala/>
      <div className="principalaContainer">
        <div className="widgets">
          <Widget tip="utilizatori" />
          <Widget tip="inregistrari" />
        </div>
        <div className="grafic">
          <Diagrama tip="principala" titlu="Înregistrările din ultimile 6 luni" aspect={4 / 1}/>
        </div>
        <div className="listaContainer">
          <div className="listaTitlu">Ultimile înregistrari</div>
          <div className="tabel"><Tabel /></div>
        </div>
      </div>
    </div>
  )
}

export default Principal