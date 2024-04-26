import BusBooking from "./pages/BusBooking";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BusBooking />} />
        <Route path="/home/:bus_id" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
