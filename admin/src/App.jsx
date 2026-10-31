import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Add from "./pages/Add";


function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/addcourse" element={<Add/>}/>
     </Routes>
    </>
  );
}

export default App;
