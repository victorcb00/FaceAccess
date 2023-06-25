import Principala from "./pagini/principala/Principala";
import Lista from "./pagini/lista/Lista";
import Login from "./pagini/login/Login";
import Modificare from "./pagini/login/Modificare";
import UtilizatorInformatie from "./pagini/utilizatorInformatie/UtilizatorInformatie";
import UtilizatorDetalii from "./pagini/utilizatorDetalii/UtilizatorDetalii";
import Livestream from "./pagini/livestream/Livestream";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({children}) => {
    return currentUser ? (children) : <Navigate to="/login" />
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<RequireAuth><Principala/></RequireAuth>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="modificare" element={<Modificare/>}/>
          <Route path="utilizatori">
            <Route index element={<RequireAuth><Lista tip="utilizatori" /></RequireAuth>}/>
            <Route path="nou" element={<RequireAuth><UtilizatorInformatie tip="nou"/></RequireAuth>}/>
            <Route path=":utilizatorID">
              <Route index element={<RequireAuth><UtilizatorDetalii/></RequireAuth>}/>
              <Route path="editeaza" element={<RequireAuth><UtilizatorInformatie tip="editeaza"/></RequireAuth>}/>
            </Route>
          </Route>
          <Route path="inregistrari" element={<RequireAuth><Lista tip="inregistrari" /></RequireAuth>}/>
          <Route path="livestream" element={<RequireAuth><Livestream/></RequireAuth>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;