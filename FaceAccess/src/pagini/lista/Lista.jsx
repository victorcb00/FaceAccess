import "./lista.scss";
import BaraLaterala from "../../componente/baraLaterala/BaraLaterala";
import TabelEditabilInregistrari from "../../componente/tabelEditabil/TabelEditabilInregistrari";
import TabelEditabilUtilizatori from "../../componente/tabelEditabil/TabelEditabilUtilizatori";

const Lista = ({tip}) => {
  return (
    <div className="lista">
      <BaraLaterala/>
      <div className="listaContainer">
        {tip === "utilizatori" ? <TabelEditabilUtilizatori /> : <TabelEditabilInregistrari />}
      </div>
    </div>
  )
}

export default Lista