import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Booking from "./pages/Booking";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addcourse" element={<Add />} />
        <Route path="/listcourse" element={<List />} />
        <Route path="/bookings" element={<Booking />} />
      </Routes>
    </>
  );
}

export default App;
