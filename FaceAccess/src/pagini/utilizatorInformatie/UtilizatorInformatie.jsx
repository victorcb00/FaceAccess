import "./utilizatorInformatie.scss";
import BaraLaterala from  "../../componente/baraLaterala/BaraLaterala";
import Formular from  "../../componente/formular/Formular";

const utilizatorInformatie = ({tip}) => {
  return (
    <div className="utilizatorNou">
      <BaraLaterala/>
      {tip === "nou" ? <Formular tip="nou"/> : <Formular tip="editeaza"/>}
    </div>
  )
}

export default utilizatorInformatie