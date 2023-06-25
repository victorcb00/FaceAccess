import "./livestream.scss";
import BaraLaterala from "../../componente/baraLaterala/BaraLaterala";

const Livestream = () => {
  return (
    <div className="livestream">
      <BaraLaterala/>
      <div className="livestreamContainer">
        <div className="titlu">
            Livestream
        </div>
        <img src="https://192.168.31.58:5000/livestream" alt="Serverul se încarcă"/>
      </div>
    </div>
  )
}

export default Livestream