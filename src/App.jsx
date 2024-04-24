import BusBooking from "./pages/BusBooking";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BusBooking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
